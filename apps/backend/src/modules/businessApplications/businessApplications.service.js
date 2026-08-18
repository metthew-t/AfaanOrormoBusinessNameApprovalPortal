// apps/backend/src/modules/businessApplications/businessApplications.service.js
// Business logic for application lifecycle.

const { v4: uuidv4 } = require('uuid');
const prisma = require('../../config/database');
const repo = require('./businessApplications.repository');
const { validateBusinessName } = require('../businessNames/businessNames.service');
const { normalizeBusinessName } = require('../../../../../shared/utils/normalizeBusinessName');
const { APPLICATION_STATUS, PERMISSION_STATUS, LANGUAGE_REVIEW_STATUS, isValidTransition, DOCUMENT_TYPE } = require('../../../../../shared/constants/statuses');
const { ROLES } = require('../../../../../shared/constants/roles');
const { writeAuditLog, writeAuditLogInTransaction } = require('../auditLogs/auditLog.service');
const { createNotification } = require('../notifications/notification.service');

/** Generates a unique application number e.g. APP-2024-000001 */
function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `APP-${year}-${rand}`;
}

/** Creates a DRAFT application */
async function createApplication({ applicantId, proposedBusinessName, businessCategoryId, businessDescription, businessAddress }, ipAddress) {
  const normalized = normalizeBusinessName(proposedBusinessName);
  const appNumber = generateApplicationNumber();

  // Verify category exists
  const category = await prisma.businessCategory.findFirst({
    where: { id: parseInt(businessCategoryId, 10), isActive: true },
  });
  if (!category) {
    const err = new Error('Gosa daldalaa filame hin argamne.');
    err.status = 404;
    throw err;
  }

  const application = await repo.create({
    applicationNumber: appNumber,
    applicantId,
    proposedBusinessName: proposedBusinessName.trim(),
    normalizedBusinessName: normalized,
    businessCategoryId: parseInt(businessCategoryId, 10),
    businessDescription,
    businessAddress,
    status: APPLICATION_STATUS.DRAFT,
  });

  await writeAuditLog({
    actorUserId: applicantId,
    action: 'APPLICATION_CREATED',
    entityType: 'BusinessApplication',
    entityId: application.id,
    newValue: { applicationNumber: appNumber, proposedBusinessName, status: APPLICATION_STATUS.DRAFT },
    ipAddress,
  });

  return application;
}

/** Submits a DRAFT application — runs automatic validation, transitions to PERMISSION_PENDING or AUTOMATIC_VALIDATION_FAILED */
async function submitApplication(applicationId, applicantId, ipAddress) {
  const application = await repo.findByIdOwned(applicationId, applicantId);

  if (!application) {
    const err = new Error('Iyyatni hin argamne.');
    err.status = 404;
    throw err;
  }

  if (application.status !== APPLICATION_STATUS.DRAFT) {
    const err = new Error('Iyyatni DRAFT ta\'e qofa erguu ni danda\'ama.');
    err.status = 400;
    throw err;
  }

  // Check identity verified
  const verified = await prisma.identityVerification.findFirst({
    where: { userId: applicantId, status: 'VERIFIED' },
  });
  if (!verified) {
    const err = new Error('Eenyummaa mirkaneessuu barbaachisaa dha. Dursitee eenyummaa kee mirkaneessi.');
    err.status = 400;
    throw err;
  }

  // Run automatic validation
  const validationResult = await validateBusinessName(application.proposedBusinessName, applicationId);

  const prevStatus = application.status;

  if (!validationResult.valid) {
    // Transition to AUTOMATIC_VALIDATION_FAILED
    const updated = await repo.update(applicationId, {
      status: APPLICATION_STATUS.AUTOMATIC_VALIDATION_FAILED,
      submittedAt: new Date(),
    });

    await writeAuditLog({
      actorUserId: applicantId,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'BusinessApplication',
      entityId: applicationId,
      previousValue: { status: prevStatus },
      newValue: { status: APPLICATION_STATUS.AUTOMATIC_VALIDATION_FAILED, validationResult },
      ipAddress,
    });

    return { application: updated, validationResult };
  }

  // Transition to PERMISSION_PENDING — create permission record
  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.businessApplication.update({
      where: { id: applicationId },
      data: {
        status: APPLICATION_STATUS.PERMISSION_PENDING,
        submittedAt: new Date(),
        normalizedBusinessName: validationResult.normalizedName,
      },
    });

    await tx.businessPermission.create({
      data: {
        applicationId,
        status: PERMISSION_STATUS.PENDING,
      },
    });

    await writeAuditLogInTransaction(tx, {
      actorUserId: applicantId,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'BusinessApplication',
      entityId: applicationId,
      previousValue: { status: prevStatus },
      newValue: { status: APPLICATION_STATUS.PERMISSION_PENDING },
      ipAddress,
    });

    return app;
  });

  return { application: await repo.findById(applicationId), validationResult };
}

/** BUSINESS_OWNER submits a correction (PERMISSION_CORRECTION_REQUIRED or LANGUAGE_CORRECTION_REQUIRED) */
async function submitCorrection(applicationId, applicantId, { correctionNote, proposedBusinessName }, ipAddress) {
  const application = await repo.findByIdOwned(applicationId, applicantId);

  if (!application) {
    const err = new Error('Iyyatni hin argamne.');
    err.status = 404;
    throw err;
  }

  const CORRECTABLE = [
    APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED,
    APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED,
    APPLICATION_STATUS.AUTOMATIC_VALIDATION_FAILED,
  ];

  if (!CORRECTABLE.includes(application.status)) {
    const err = new Error('Iyyatni kun yeroo ammaa sirreessuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const prevStatus = application.status;
  let updateData = {};

  if (proposedBusinessName) {
    const normalized = normalizeBusinessName(proposedBusinessName);
    updateData.proposedBusinessName = proposedBusinessName.trim();
    updateData.normalizedBusinessName = normalized;
  }

  // Determine next status
  let nextStatus;
  if (prevStatus === APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED) {
    nextStatus = APPLICATION_STATUS.PERMISSION_PENDING;
    // Update permission record status back to PENDING
    await prisma.businessPermission.update({
      where: { applicationId },
      data: { status: PERMISSION_STATUS.PENDING, reviewedAt: null, reviewComment: null },
    });
  } else if (prevStatus === APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED) {
    nextStatus = APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING;
    await prisma.languageReview.update({
      where: { applicationId },
      data: { status: LANGUAGE_REVIEW_STATUS.PENDING, reviewedAt: null, reviewComment: null },
    });
  } else {
    // AUTOMATIC_VALIDATION_FAILED → re-validate
    const validationResult = await validateBusinessName(
      updateData.proposedBusinessName || application.proposedBusinessName,
      applicationId
    );
    if (!validationResult.valid) {
      const err = new Error('Maqaan sirreessame ammas mirkaneessuu dideera: ' + validationResult.reasons.join(', '));
      err.status = 422;
      throw err;
    }
    nextStatus = APPLICATION_STATUS.PERMISSION_PENDING;
    updateData.normalizedBusinessName = validationResult.normalizedName;
    // Ensure permission record exists
    const permExists = await prisma.businessPermission.findUnique({ where: { applicationId } });
    if (!permExists) {
      await prisma.businessPermission.create({ data: { applicationId, status: PERMISSION_STATUS.PENDING } });
    }
  }

  updateData.status = nextStatus;

  const updated = await repo.update(applicationId, updateData);

  await writeAuditLog({
    actorUserId: applicantId,
    action: 'CORRECTION_SUBMITTED',
    entityType: 'BusinessApplication',
    entityId: applicationId,
    previousValue: { status: prevStatus },
    newValue: { status: nextStatus, correctionNote },
    ipAddress,
  });

  return updated;
}

/** Lists applications — owners see their own; officers see scoped by status */
async function listApplications(user, { page = 1, limit = 20, status } = {}) {
  const skip = (page - 1) * limit;
  const where = {};

  if (user.role === ROLES.BUSINESS_OWNER) {
    where.applicantId = user.id;
  } else if (user.role === ROLES.FINANCIAL_OFFICER) {
    where.status = { in: [
      APPLICATION_STATUS.PERMISSION_PENDING,
      APPLICATION_STATUS.PERMISSION_APPROVED,
      APPLICATION_STATUS.PERMISSION_REJECTED,
      APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED,
    ]};
  } else if (user.role === ROLES.LANGUAGE_OFFICER) {
    where.status = { in: [
      APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING,
      APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED,
      APPLICATION_STATUS.LANGUAGE_REJECTED,
      APPLICATION_STATUS.APPROVED,
    ]};
  } else if (user.role === ROLES.SENIOR_OFFICER) {
    // Senior officer sees all (for oversight)
    if (status) where.status = status;
  } else if (user.role === ROLES.ADMIN) {
    if (status) where.status = status;
  }

  if (status && user.role === ROLES.BUSINESS_OWNER) where.status = status;

  const [total, applications] = await Promise.all([
    repo.count(where),
    repo.findAll({ where, skip, take: parseInt(limit, 10) }),
  ]);

  return {
    applications,
    pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(total / limit) },
  };
}

/** Get single application — ownership/role enforced */
async function getApplication(applicationId, user) {
  const application = await repo.findById(parseInt(applicationId, 10));

  if (!application) {
    const err = new Error('Iyyatni hin argamne.');
    err.status = 404;
    throw err;
  }

  // Ownership check
  if (user.role === ROLES.BUSINESS_OWNER && application.applicantId !== user.id) {
    const err = new Error('Iyyata kana ilaaluuf hayyama hin qabdu.');
    err.status = 403;
    throw err;
  }

  return application;
}

/** Update a DRAFT application (owner only) */
async function updateApplication(applicationId, applicantId, data, ipAddress) {
  const application = await repo.findByIdOwned(parseInt(applicationId, 10), applicantId);

  if (!application) {
    const err = new Error('Iyyatni hin argamne.');
    err.status = 404;
    throw err;
  }

  if (application.status !== APPLICATION_STATUS.DRAFT) {
    const err = new Error('DRAFT ta\'an qofa jijjiiruu ni danda\'ama.');
    err.status = 400;
    throw err;
  }

  const updateData = {};
  if (data.proposedBusinessName) {
    updateData.proposedBusinessName = data.proposedBusinessName.trim();
    updateData.normalizedBusinessName = normalizeBusinessName(data.proposedBusinessName);
  }
  if (data.businessCategoryId) updateData.businessCategoryId = parseInt(data.businessCategoryId, 10);
  if (data.businessDescription) updateData.businessDescription = data.businessDescription;
  if (data.businessAddress) updateData.businessAddress = data.businessAddress;

  const updated = await repo.update(parseInt(applicationId, 10), updateData);

  await writeAuditLog({
    actorUserId: applicantId,
    action: 'APPLICATION_UPDATED',
    entityType: 'BusinessApplication',
    entityId: parseInt(applicationId, 10),
    previousValue: { proposedBusinessName: application.proposedBusinessName },
    newValue: updateData,
    ipAddress,
  });

  return updated;
}

/** Get timeline events for an application */
async function getTimeline(applicationId, user) {
  const application = await getApplication(applicationId, user);

  const logs = await prisma.auditLog.findMany({
    where: { entityType: 'BusinessApplication', entityId: parseInt(applicationId, 10) },
    orderBy: { createdAt: 'asc' },
    include: {
      actor: { select: { id: true, fullName: true } },
    },
  });

  return { application, timeline: logs };
}

/** List applications that have correction requests for this owner */
async function listCorrections(userId) {
  const apps = await prisma.businessApplication.findMany({
    where: {
      applicantId: userId,
      status: {
        in: [
          'PERMISSION_CORRECTION_REQUIRED',
          'LANGUAGE_CORRECTION_REQUIRED',
        ],
      },
    },
    include: {
      businessCategory: { select: { id: true, name: true } },
      permission: { select: { status: true, reviewComment: true } },
      languageReview: { select: { status: true, reviewComment: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return apps.map(app => ({
    id: app.id.toString(),
    applicationNumber: app.applicationNumber,
    businessName: app.proposedBusinessName,
    category: app.businessCategory?.name || '',
    status: app.status,
    correctionNote:
      app.permission?.reviewComment ||
      app.languageReview?.reviewComment ||
      '',
    updatedAt: app.updatedAt,
  }));
}

module.exports = {
  createApplication,
  submitApplication,
  submitCorrection,
  listApplications,
  getApplication,
  updateApplication,
  getTimeline,
  listCorrections,
};
