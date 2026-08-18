const prisma = require('../../config/database');
const { APPLICATION_STATUS, COMMUNICATION_STATUS, TURIZM_STATUS, COMMERCIAL_STATUS } = require('../../../../../shared/constants/statuses');

async function getStats() {
  const newApplications = await prisma.businessApplication.count({
    where: { status: APPLICATION_STATUS.SUBMITTED }
  });
  const inProgress = await prisma.businessApplication.count({
    where: {
      status: { in: [APPLICATION_STATUS.PERMISSION_PENDING, APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING] }
    }
  });
  const completed = await prisma.businessApplication.count({
    where: { status: { in: [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.LANGUAGE_REJECTED, APPLICATION_STATUS.PERMISSION_REJECTED] } }
  });
  const unreadMessages = await prisma.communicationMessage.count({
    where: { isRead: false }
  });

  return { newApplications, inProgress, completed, unreadMessages };
}

async function getIncomingApplications() {
  const apps = await prisma.businessApplication.findMany({
    where: { status: APPLICATION_STATUS.SUBMITTED },
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      documents: true
    }
  });

  // Map to frontend expectation
  return apps.map(app => ({
    id: app.id.toString(),
    applicationNumber: app.applicationNumber,
    businessName: app.proposedBusinessName,
    owner: { fullName: app.applicant.fullName, email: app.applicant.email },
    category: app.businessCategory.name,
    description: app.businessDescription,
    permissionDocument: app.documents[0] ? { fileName: app.documents[0].originalFilename } : null,
    submittedAt: app.submittedAt,
    status: 'SUBMITTED',
  }));
}

async function getApplicationDetail(id) {
  const app = await prisma.businessApplication.findUnique({
    where: { id },
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      documents: true
    }
  });

  if (!app) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }

  return {
    id: app.id.toString(),
    applicationNumber: app.applicationNumber,
    businessName: app.proposedBusinessName,
    owner: { fullName: app.applicant.fullName, email: app.applicant.email },
    category: app.businessCategory.name,
    description: app.businessDescription,
    permissionDocument: app.documents[0] ? { fileName: app.documents[0].originalFilename } : null,
    submittedAt: app.submittedAt,
    status: app.status === APPLICATION_STATUS.SUBMITTED ? 'SUBMITTED' : app.status,
  };
}

async function routeApplication(id, { routeToCommercial, routeToTurizm }, officerId, ipAddress) {
  return prisma.$transaction(async (tx) => {
    const updateData = { status: APPLICATION_STATUS.PERMISSION_PENDING }; // Moves it to next phase
    
    if (routeToCommercial) {
      updateData.commercialStatus = COMMERCIAL_STATUS.PENDING;
    }
    if (routeToTurizm) {
      updateData.turizmStatus = TURIZM_STATUS.PENDING;
    }

    await tx.businessApplication.update({
      where: { id },
      data: updateData
    });

    await tx.auditLog.create({
      data: {
        actorUserId: officerId,
        action: 'APPLICATION_ROUTED',
        entityType: 'BusinessApplication',
        entityId: id,
        ipAddress,
        newValue: updateData,
      }
    });
  });
}

async function getMessages(userId) {
  return prisma.communicationMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

async function sendMessage(user, { recipient, subject, body, applicationNumber }) {
  return prisma.communicationMessage.create({
    data: {
      subject,
      body,
      senderName: user.fullName,
      senderDepartment: 'Communication Biro', // Or get from role
      applicationNumber,
      isRead: false
    }
  });
}

async function markMessageRead(id, userId) {
  return prisma.communicationMessage.update({
    where: { id },
    data: { isRead: true }
  });
}

async function getApplicationsFromDepartment(department) {
  const where = {};
  if (department === 'commercial') {
    where.commercialStatus = { not: COMMERCIAL_STATUS.PENDING };
    where.commercialStatus = { not: null };
  } else if (department === 'turizm') {
    where.turizmStatus = { not: TURIZM_STATUS.PENDING };
    where.turizmStatus = { not: null };
  }

  const apps = await prisma.businessApplication.findMany({
    where,
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      documents: true
    }
  });

  return apps.map(app => ({
    id: app.id.toString(),
    applicationNumber: app.applicationNumber,
    businessName: app.proposedBusinessName,
    category: { id: app.businessCategory.id.toString(), name: app.businessCategory.name },
    description: app.businessDescription,
    submittedAt: app.submittedAt,
    turizmStatus: app.turizmStatus,
    turizmComment: app.turizmComment,
    turizmReviewedAt: app.turizmReviewedAt,
    commercialStatus: app.commercialStatus,
    commercialComment: app.commercialComment,
    commercialReviewedAt: app.commercialReviewedAt,
    permitDocuments: app.documents.map(d => ({ name: d.originalFilename, url: '#' }))
  }));
}

async function updateApplicationStatus(id, { status, comment }, userId, ipAddress) {
  return prisma.businessApplication.update({
    where: { id },
    data: { status }
  });
}

async function acceptApplication({ applicationId, reason }, userId, ipAddress) {
  return prisma.$transaction(async (tx) => {
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.APPROVED }
    });
    // Can send notification here
  });
}

async function rejectApplication({ applicationId, reason }, userId, ipAddress) {
  return prisma.$transaction(async (tx) => {
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: { status: APPLICATION_STATUS.PERMISSION_REJECTED } // Terminate
    });
  });
}

async function sendFinalDecision({ applicationId, decision, reason, source }, userId, ipAddress) {
  return prisma.businessApplication.update({
    where: { id: applicationId },
    data: {
      finalDecision: decision,
      finalDecisionReason: reason,
      status: decision === 'APPROVED' ? APPLICATION_STATUS.APPROVED : APPLICATION_STATUS.PERMISSION_REJECTED
    }
  });
}

module.exports = {
  getStats,
  getIncomingApplications,
  getApplicationDetail,
  routeApplication,
  getMessages,
  sendMessage,
  markMessageRead,
  getApplicationsFromDepartment,
  updateApplicationStatus,
  acceptApplication,
  rejectApplication,
  sendFinalDecision
};
