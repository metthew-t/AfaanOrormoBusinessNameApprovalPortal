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
} = require('../../../../../shared/constants/statuses');
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
 * Approve language review (new parallel workflow)
 * No longer requires permission to be APPROVED first - both offices review independently
 */
async function approveLanguageReview(reviewId, officerId, { reviewComment, suggestedBusinessName }, ipAddress) {
  const review = await getLanguageReview(reviewId);

  // State machine guard
  if (review.status !== LANGUAGE_REVIEW_STATUS.PENDING && review.status !== LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Madaalliin afaanii kun yeroo ammaa mirkaneessuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = review.applicationId;
  const application = review.application;

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

    // Update application turizmStatus and optionally update business name
    const updateData = { 
      turizmStatus: 'APPROVED', 
      turizmComment: reviewComment, 
      turizmReviewedAt: new Date() 
    };
    
    // If language officer suggested a corrected name, update it
    if (suggestedBusinessName && suggestedBusinessName.trim()) {
      updateData.proposedBusinessName = suggestedBusinessName.trim();
      // Also add note to comment about name correction
      updateData.turizmComment = reviewComment + 
        (reviewComment ? '\n\n' : '') + 
        `[Maqaan sirreeffameera: "${application.proposedBusinessName}" → "${suggestedBusinessName}"]`;
    }
    
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: updateData,
    });

    // Check if commercial/permission review is also completed
    const permission = await tx.businessPermission.findUnique({ where: { applicationId } });
    const bothReviewsComplete = permission && 
      (permission.status === PERMISSION_STATUS.APPROVED || 
       permission.status === PERMISSION_STATUS.REJECTED);

    if (bothReviewsComplete) {
      // Both reviews done - send back to Communication for final decision
      await tx.businessApplication.update({
        where: { id: applicationId },
        data: { status: APPLICATION_STATUS.REVIEWS_COMPLETED },
      });

      // Notify all communication officers
      const communicationOfficers = await tx.user.findMany({
        where: { 
          role: { name: 'FINANCIAL_OFFICER' },
          isActive: true 
        },
        select: { id: true }
      });
      
      const app = await tx.businessApplication.findUnique({ 
        where: { id: applicationId },
        select: { applicationNumber: true, proposedBusinessName: true }
      });

      for (const officer of communicationOfficers) {
        await createNotification({
          recipientId: officer.id,
          title: 'Gamaaggamni Xumurameera',
          message: `Iyyatni ${app.applicationNumber} (${app.proposedBusinessName}) Waajira lamaan irraa gamaaggama xumureera. Murtee dhumaa kennaa.`,
          type: NOTIFICATION_TYPE.REVIEW_COMPLETED,
          applicationId,
          tx
        });
      }
    }

    // Audit log
    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'LANGUAGE_REVIEW_APPROVED',
      entityType: 'LanguageReview',
      entityId: parseInt(reviewId, 10),
      previousValue: { status: review.status },
      newValue: {
        status: LANGUAGE_REVIEW_STATUS.APPROVED,
        reviewComment,
      },
      ipAddress,
    });

    return { success: true };
  });

  return result;
}

async function rejectLanguageReview(reviewId, officerId, { reviewComment, suggestedBusinessName }, ipAddress) {
  const review = await getLanguageReview(reviewId);

  if (review.status !== LANGUAGE_REVIEW_STATUS.PENDING && review.status !== LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Madaalliin afaanii kun yeroo ammaa diduu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = review.applicationId;
  const application = review.application;

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

    // Update application turizmStatus and optionally suggest corrected name in comment
    let comment = reviewComment;
    if (suggestedBusinessName && suggestedBusinessName.trim()) {
      comment = reviewComment + 
        (reviewComment ? '\n\n' : '') + 
        `[Maqaa sirreeffamuu danda'u: "${suggestedBusinessName}"]`;
    }
    
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { turizmStatus: 'REJECTED', turizmComment: comment, turizmReviewedAt: new Date() },
    });

    // Check if commercial/permission review is also completed
    const permission = await tx.businessPermission.findUnique({ where: { applicationId } });
    const bothReviewsComplete = permission && 
      (permission.status === PERMISSION_STATUS.APPROVED || 
       permission.status === PERMISSION_STATUS.REJECTED);

    if (bothReviewsComplete) {
      // Both reviews done - send back to Communication for final decision
      await tx.businessApplication.update({
        where: { id: applicationId },
        data: { status: APPLICATION_STATUS.REVIEWS_COMPLETED },
      });

      // Notify all communication officers
      const communicationOfficers = await tx.user.findMany({
        where: { 
          role: { name: 'FINANCIAL_OFFICER' },
          isActive: true 
        },
        select: { id: true }
      });
      
      const app = await tx.businessApplication.findUnique({ 
        where: { id: applicationId },
        select: { applicationNumber: true, proposedBusinessName: true }
      });

      for (const officer of communicationOfficers) {
        await createNotification({
          recipientId: officer.id,
          title: 'Gamaaggamni Xumurameera',
          message: `Iyyatni ${app.applicationNumber} (${app.proposedBusinessName}) Waajira lamaan irraa gamaaggama xumureera. Murtee dhumaa kennaa.`,
          type: NOTIFICATION_TYPE.REVIEW_COMPLETED,
          applicationId,
          tx
        });
      }
    }

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
