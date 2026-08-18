// apps/backend/src/modules/permissions/permissions.service.js
// Financial Officer permission review logic

const prisma = require('../../config/database');
const { APPLICATION_STATUS, PERMISSION_STATUS, LANGUAGE_REVIEW_STATUS, NOTIFICATION_TYPE } = require('../../../../../shared/constants/statuses');
const { writeAuditLog, writeAuditLogInTransaction } = require('../auditLogs/auditLog.service');
const { createNotification } = require('../notifications/notification.service');

const PERMISSION_INCLUDE = {
  application: {
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      documents: true,
    },
  },
  reviewer: { select: { id: true, fullName: true } },
};

/** List permission queue for Financial Officer */
async function listPermissions({ page = 1, limit = 20, status } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) {
    where.status = status;
  } else {
    where.status = { in: [PERMISSION_STATUS.PENDING, PERMISSION_STATUS.CORRECTION_REQUIRED] };
  }

  const [total, permissions] = await Promise.all([
    prisma.businessPermission.count({ where }),
    prisma.businessPermission.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
      orderBy: { createdAt: 'asc' }, // FIFO
      include: PERMISSION_INCLUDE,
    }),
  ]);

  return { permissions, pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(total / limit) } };
}

/** Get single permission detail */
async function getPermission(permissionId) {
  const permission = await prisma.businessPermission.findUnique({
    where: { id: parseInt(permissionId, 10) },
    include: PERMISSION_INCLUDE,
  });

  if (!permission) {
    const err = new Error('Hayyamni hin argamne.');
    err.status = 404;
    throw err;
  }

  return permission;
}

/** Approve permission */
async function approvePermission(permissionId, officerId, { reviewComment }, ipAddress) {
  const permission = await getPermission(permissionId);

  if (permission.status !== PERMISSION_STATUS.PENDING && permission.status !== PERMISSION_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Hayyamni kun yeroo ammaa mirkaneessuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = permission.applicationId;

  const result = await prisma.$transaction(async (tx) => {
    // Update permission
    const updatedPerm = await tx.businessPermission.update({
      where: { id: parseInt(permissionId, 10) },
      data: {
        status: PERMISSION_STATUS.APPROVED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    // Update application status to PERMISSION_APPROVED then LANGUAGE_REVIEW_PENDING
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.PERMISSION_APPROVED },
    });

    // Immediately create language review record and advance to LANGUAGE_REVIEW_PENDING
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING },
    });

    const existingLR = await tx.languageReview.findUnique({ where: { applicationId } });
    if (!existingLR) {
      await tx.languageReview.create({
        data: { applicationId, status: LANGUAGE_REVIEW_STATUS.PENDING },
      });
    }

    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'PERMISSION_APPROVED',
      entityType: 'BusinessPermission',
      entityId: parseInt(permissionId, 10),
      previousValue: { status: permission.status },
      newValue: { status: PERMISSION_STATUS.APPROVED, applicationStatus: APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING },
      ipAddress,
    });

    return updatedPerm;
  });

  // Notify applicant
  const app = await prisma.businessApplication.findUnique({ where: { id: applicationId } });
  await createNotification({
    recipientId: app.applicantId,
    title: 'Hayyamni Mirkana\'e',
    message: `Iyyatni kee ${app.applicationNumber} hayyama faayinaansii argateera. Haala afaan Oromoo ammaan ilaalama jira.`,
    type: NOTIFICATION_TYPE.PERMISSION_APPROVED,
    relatedEntityId: parseInt(permissionId, 10),
    applicationId,
  });

  return result;
}

/** Reject permission */
async function rejectPermission(permissionId, officerId, { reviewComment }, ipAddress) {
  const permission = await getPermission(permissionId);

  if (permission.status !== PERMISSION_STATUS.PENDING && permission.status !== PERMISSION_STATUS.CORRECTION_REQUIRED) {
    const err = new Error('Hayyamni kun yeroo ammaa diduu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = permission.applicationId;

  await prisma.$transaction(async (tx) => {
    await tx.businessPermission.update({
      where: { id: parseInt(permissionId, 10) },
      data: {
        status: PERMISSION_STATUS.REJECTED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.PERMISSION_REJECTED },
    });

    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'PERMISSION_REJECTED',
      entityType: 'BusinessPermission',
      entityId: parseInt(permissionId, 10),
      previousValue: { status: permission.status },
      newValue: { status: PERMISSION_STATUS.REJECTED, reviewComment },
      ipAddress,
    });
  });

  const app = await prisma.businessApplication.findUnique({ where: { id: applicationId } });
  await createNotification({
    recipientId: app.applicantId,
    title: 'Hayyamni Dide',
    message: `Iyyatni kee ${app.applicationNumber} hayyama faayinaansii argachuu dideera. ${reviewComment || ''}`,
    type: NOTIFICATION_TYPE.PERMISSION_REJECTED,
    relatedEntityId: parseInt(permissionId, 10),
    applicationId,
  });

  return await getPermission(permissionId);
}

/** Request correction from owner */
async function requestCorrection(permissionId, officerId, { reviewComment }, ipAddress) {
  const permission = await getPermission(permissionId);

  if (permission.status !== PERMISSION_STATUS.PENDING) {
    const err = new Error('Hayyamni kun yeroo ammaa sirreessuu gaafachuu hin danda\'amu.');
    err.status = 400;
    throw err;
  }

  const applicationId = permission.applicationId;

  await prisma.$transaction(async (tx) => {
    await tx.businessPermission.update({
      where: { id: parseInt(permissionId, 10) },
      data: {
        status: PERMISSION_STATUS.CORRECTION_REQUIRED,
        reviewedById: officerId,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED },
    });

    await writeAuditLogInTransaction(tx, {
      actorUserId: officerId,
      action: 'PERMISSION_CORRECTION_REQUESTED',
      entityType: 'BusinessPermission',
      entityId: parseInt(permissionId, 10),
      previousValue: { status: permission.status },
      newValue: { status: PERMISSION_STATUS.CORRECTION_REQUIRED, reviewComment },
      ipAddress,
    });
  });

  const app = await prisma.businessApplication.findUnique({ where: { id: applicationId } });
  await createNotification({
    recipientId: app.applicantId,
    title: 'Sirreessuu Barbaachisaa Dha',
    message: `Iyyatni kee ${app.applicationNumber} sirreessuu barbaachisa: ${reviewComment || ''}`,
    type: NOTIFICATION_TYPE.PERMISSION_CORRECTION_REQUIRED,
    relatedEntityId: parseInt(permissionId, 10),
    applicationId,
  });

  return await getPermission(permissionId);
}

module.exports = { listPermissions, getPermission, approvePermission, rejectPermission, requestCorrection };
