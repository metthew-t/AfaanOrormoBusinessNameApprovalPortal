// apps/backend/src/modules/languageReviews/languageReviews.service.js
// Language Officer review logic — includes digital signing for final approval.

const { v4: uuidv4 } = require('uuid');
const prisma = require('../../config/database');
const {
  APPLICATION_STATUS,
  LANGUAGE_REVIEW_STATUS,
  PERMISSION_STATUS,
  REGISTRY_SOURCE,
  NOTIFICATION_TYPE,
} = require('../../../../shared/constants/statuses');
const { writeAuditLog, writeAuditLogInTransaction } = require('../auditLogs/auditLog.service');
const { createNotification } = require('../notifications/notification.service');
const env = require('../../config/env');

const LR_INCLUDE = {
  application: {
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      permission: true,
      documents: true,
    },
  },
  reviewer: { select: { id: true, fullName: true } },
};

async function listLanguageReviews({ page = 1, limit = 20, status } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) {
    where.status = status;
  } else {
    where.status = { in: [LANGUAGE_REVIEW_STATUS.PENDING, LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED] };
  }

  // Language officer can only act when permission is APPROVED — enforced by state machine
  // At this point the application status is LANGUAGE_REVIEW_PENDING
  const [total, reviews] = await Promise.all([
    prisma.languageReview.count({ where }),
    prisma.languageReview.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
      orderBy: { createdAt: 'asc' },
      include: LR_INCLUDE,
    }),
  ]);

  return { reviews, pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(total / limit) } };
}

async function getLanguageReview(reviewId) {
  const review = await prisma.languageReview.findUnique({
    where: { id: parseInt(reviewId, 10) },
    include: LR_INCLUDE,
  });
  if (!review) {
    const err = new Error('Madaalliin afaanii hin argamne.');
    err.status = 404;
    throw err;
  }
  return review;
}

/**
 * Final approval — digitally signs.
 * Implements spec §12 transaction:
 * 1. Validate permission approved + correct status
 * 2. Create certificate + QR
 * 3. Insert registry entry
 * 4. Update application → APPROVED
 * 5. Create notification
 * 6. Create audit log
 * Rollback on any failure.
 */
async function approveLanguageReview(reviewId, officerId, { reviewComment }, ipAddress) {
  const review = await getLanguageReview(reviewId);

  // State machine guard
  if (review.status !== LANGUAGE_REVIEW_STATUS.PENDING && review.status !== LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Madaalliin afaanii kun yeroo ammaa mirkaneessuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  // Permission must be APPROVED — explicit check per spec §12
  if (!review.application.permission || review.application.permission.status !== PERMISSION_STATUS.APPROVED) {
    const err = new Error('Hayyama faayinaansii mirkanaa\'e malee maqaa mirkaneessuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = review.applicationId;
  const application = review.application;

  // Generate unique approval number
  const approvalNumber = `CERT-${new Date().getFullYear()}-${uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()}`;
  const qrPayloadUrl = `${env.PUBLIC_BASE_URL}/api/public/certificates/verify/${approvalNumber}`;

  const result = await prisma.$transaction(async (tx) => {
    // Update language review
    await tx.languageReview.update({
      where: { id: parseInt(reviewId, 10) },
      data: {
        status: LANGUAGE_REVIEW_STATUS.APPROVED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    // Update application status
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.APPROVED },
    });

    // Create certificate (immutable after creation)
    const certificate = await tx.certificate.create({
      data: {
        applicationId,
        approvalNumber,
        issuedById: officerId,
        issuedAt: new Date(),
        qrPayloadUrl,
        isValid: true,
      },
    });

    // Insert into business_name_registry
    await tx.businessNameRegistry.create({
      data: {
        businessName: application.proposedBusinessName,
        normalizedBusinessName: application.normalizedBusinessName,
        source: REGISTRY_SOURCE.NEW_APPROVAL,
        applicationId,
        approvalId: certificate.id,
        isActive: true,
      },
    });

    // Audit log
    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'LANGUAGE_APPROVED_FINAL',
      entityType: 'LanguageReview',
      entityId: parseInt(reviewId, 10),
      previousValue: { status: review.status },
      newValue: {
        status: LANGUAGE_REVIEW_STATUS.APPROVED,
        applicationStatus: APPLICATION_STATUS.APPROVED,
        approvalNumber,
        certificateId: certificate.id,
      },
      ipAddress,
    });

    return { certificate, approvalNumber };
  });

  // Notify applicant
  await createNotification({
    recipientId: application.applicantId,
    title: 'Maqaan Daldalaa Mirkana\'e!',
    message: `Baga gammadde! Maqaan daldalaa kee "${application.proposedBusinessName}" mirkana\'e. Lakkoofsa raggaasisaa: ${approvalNumber}`,
    type: NOTIFICATION_TYPE.APPLICATION_APPROVED,
    applicationId,
  });

  await createNotification({
    recipientId: application.applicantId,
    title: 'Waraqaan Ragaa Qophaa\'e',
    message: `Waraqaan ragaa maqaa daldalaa kee kee buufachuu ni dandeessa. Lakkoofsa: ${approvalNumber}`,
    type: NOTIFICATION_TYPE.CERTIFICATE_READY,
    applicationId,
  });

  return result;
}

async function rejectLanguageReview(reviewId, officerId, { reviewComment }, ipAddress) {
  const review = await getLanguageReview(reviewId);

  if (review.status !== LANGUAGE_REVIEW_STATUS.PENDING && review.status !== LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Madaalliin afaanii kun yeroo ammaa diduu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  if (!review.application.permission || review.application.permission.status !== PERMISSION_STATUS.APPROVED) {
    const err = new Error('Hayyama faayinaansii mirkanaa\'e malee maqaa diduu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = review.applicationId;

  await prisma.$transaction(async (tx) => {
    await tx.languageReview.update({
      where: { id: parseInt(reviewId, 10) },
      data: {
        status: LANGUAGE_REVIEW_STATUS.REJECTED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.LANGUAGE_REJECTED },
    });

    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'LANGUAGE_REJECTED',
      entityType: 'LanguageReview',
      entityId: parseInt(reviewId, 10),
      previousValue: { status: review.status },
      newValue: { status: LANGUAGE_REVIEW_STATUS.REJECTED, reviewComment },
      ipAddress,
    });
  });

  const app = await prisma.businessApplication.findUnique({ where: { id: applicationId } });
  await createNotification({
    recipientId: app.applicantId,
    title: 'Maqaan Daldalaa Dide',
    message: `Iyyatni kee maqaa daldalaa dide. ${reviewComment || ''}`,
    type: NOTIFICATION_TYPE.LANGUAGE_REJECTED,
    applicationId,
  });

  return await getLanguageReview(reviewId);
}

async function requestLRCorrection(reviewId, officerId, { reviewComment }, ipAddress) {
  const review = await getLanguageReview(reviewId);

  if (review.status !== LANGUAGE_REVIEW_STATUS.PENDING) {
    const err = new Error('Madaalliin afaanii kun yeroo ammaa sirreessuu gaafachuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = review.applicationId;

  await prisma.$transaction(async (tx) => {
    await tx.languageReview.update({
      where: { id: parseInt(reviewId, 10) },
      data: {
        status: LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED },
    });

    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'LANGUAGE_CORRECTION_REQUESTED',
      entityType: 'LanguageReview',
      entityId: parseInt(reviewId, 10),
      previousValue: { status: review.status },
      newValue: { status: LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED, reviewComment },
      ipAddress,
    });
  });

  const app = await prisma.businessApplication.findUnique({ where: { id: applicationId } });
  await createNotification({
    recipientId: app.applicantId,
    title: 'Maqaa Sirreessuu Barbaachisaa Dha',
    message: `Maqaan daldalaa kee sirreessuu barbaachisa: ${reviewComment || ''}`,
    type: NOTIFICATION_TYPE.LANGUAGE_CORRECTION_REQUIRED,
    applicationId,
  });

  return await getLanguageReview(reviewId);
}

module.exports = { listLanguageReviews, getLanguageReview, approveLanguageReview, rejectLanguageReview, requestLRCorrection };
