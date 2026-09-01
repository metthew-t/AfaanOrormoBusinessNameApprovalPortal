const prisma = require('../../config/database');
const { APPLICATION_STATUS, COMMUNICATION_STATUS, TURIZM_STATUS, COMMERCIAL_STATUS, PERMISSION_STATUS, LANGUAGE_REVIEW_STATUS, NOTIFICATION_TYPE } = require('../../../../../shared/constants/statuses');
const { createNotification } = require('../notifications/notification.service');

async function getStats() {
  const newApplications = await prisma.businessApplication.count({
    where: { status: APPLICATION_STATUS.SUBMITTED }
  });
  const inProgress = await prisma.businessApplication.count({
    where: {
      status: { in: [
        APPLICATION_STATUS.PARALLEL_REVIEW_PENDING,
        APPLICATION_STATUS.PERMISSION_PENDING, 
        APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING
      ] }
    }
  });
  const reviewsCompleted = await prisma.businessApplication.count({
    where: { status: APPLICATION_STATUS.REVIEWS_COMPLETED }
  });
  const completed = await prisma.businessApplication.count({
    where: { status: { in: [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED] } }
  });
  const unreadMessages = await prisma.communicationMessage.count({
    where: { isRead: false }
  });

  return { newApplications, inProgress, reviewsCompleted, completed, unreadMessages };
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
    // New workflow: Set to PARALLEL_REVIEW_PENDING when routing to both offices
    const updateData = { status: APPLICATION_STATUS.PARALLEL_REVIEW_PENDING };
    
    if (routeToCommercial) {
      updateData.commercialStatus = COMMERCIAL_STATUS.PENDING;
      const existing = await tx.businessPermission.findUnique({ where: { applicationId: id } });
      if (!existing) {
        await tx.businessPermission.create({
          data: {
            applicationId: id,
            status: PERMISSION_STATUS.PENDING,
          },
        });
      } else {
        await tx.businessPermission.update({
          where: { applicationId: id },
          data: { status: PERMISSION_STATUS.PENDING },
        });
      }

      // Notify all commercial officers (SENIOR_OFFICER role)
      const commercialOfficers = await tx.user.findMany({
        where: { 
          role: { name: 'SENIOR_OFFICER' },
          isActive: true 
        },
        select: { id: true }
      });
      
      const app = await tx.businessApplication.findUnique({ 
        where: { id },
        select: { applicationNumber: true, proposedBusinessName: true }
      });

      for (const officer of commercialOfficers) {
        await createNotification({
          recipientId: officer.id,
          title: 'Iyyata Haaraa - Gamaaggama Daldaalaa',
          message: `Iyyatni haaraan ${app.applicationNumber} (${app.proposedBusinessName}) gamaaggamaaf ergameera.`,
          type: NOTIFICATION_TYPE.APPLICATION_ROUTED,
          applicationId: id,
          tx
        });
      }
    }
    
    if (routeToTurizm) {
      updateData.turizmStatus = TURIZM_STATUS.PENDING;
      const existing = await tx.languageReview.findUnique({ where: { applicationId: id } });
      if (!existing) {
        await tx.languageReview.create({
          data: {
            applicationId: id,
            status: LANGUAGE_REVIEW_STATUS.PENDING,
          },
        });
      } else {
        await tx.languageReview.update({
          where: { applicationId: id },
          data: { status: LANGUAGE_REVIEW_STATUS.PENDING },
        });
      }

      // Notify all language officers (LANGUAGE_OFFICER role)
      const languageOfficers = await tx.user.findMany({
        where: { 
          role: { name: 'LANGUAGE_OFFICER' },
          isActive: true 
        },
        select: { id: true }
      });
      
      const app = await tx.businessApplication.findUnique({ 
        where: { id },
        select: { applicationNumber: true, proposedBusinessName: true }
      });

      for (const officer of languageOfficers) {
        await createNotification({
          recipientId: officer.id,
          title: 'Iyyata Haaraa - Gamaaggama Afaanii',
          message: `Iyyatni haaraan ${app.applicationNumber} (${app.proposedBusinessName}) gamaaggama afaaniif ergameera.`,
          type: NOTIFICATION_TYPE.APPLICATION_ROUTED,
          applicationId: id,
          tx
        });
      }
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
      senderDepartment: 'Waajira Kominikeeshinii', // Or get from role
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

/**
 * Get applications where both reviews are completed, waiting for Communication final decision
 */
async function getReviewedApplications() {
  const apps = await prisma.businessApplication.findMany({
    where: { 
      status: APPLICATION_STATUS.REVIEWS_COMPLETED
    },
    include: {
      applicant: { select: { id: true, fullName: true, email: true } },
      businessCategory: { select: { id: true, name: true } },
      permission: { include: { reviewer: { select: { fullName: true } } } },
      languageReview: { include: { reviewer: { select: { fullName: true } } } },
      documents: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  return apps.map(app => ({
    id: app.id.toString(),
    applicationNumber: app.applicationNumber,
    businessName: app.proposedBusinessName,
    owner: { fullName: app.applicant.fullName, email: app.applicant.email },
    category: app.businessCategory?.name || '',
    description: app.businessDescription,
    submittedAt: app.submittedAt,
    
    // Commercial/Daldaala review
    commercialReview: app.permission ? {
      status: app.permission.status,
      comment: app.permission.reviewComment,
      reviewedBy: app.permission.reviewer?.fullName,
      reviewedAt: app.permission.reviewedAt
    } : null,
    
    // Language/Turizm review
    languageReview: app.languageReview ? {
      status: app.languageReview.status,
      comment: app.languageReview.reviewComment,
      reviewedBy: app.languageReview.reviewer?.fullName,
      reviewedAt: app.languageReview.reviewedAt
    } : null,
    
    documents: app.documents.map(d => ({ 
      id: d.id.toString(),
      fileName: d.originalFilename,
      url: `/api/applications/${app.id}/documents/${d.id}`
    }))
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

/**
 * Communication officer makes final decision based on both reviews
 */
async function makeFinalDecision(applicationId, { decision, reason }, officerId, ipAddress) {
  return prisma.$transaction(async (tx) => {
    const finalStatus = decision === 'APPROVED' ? APPLICATION_STATUS.APPROVED : APPLICATION_STATUS.REJECTED;
    
    // Get application with applicant info
    const app = await tx.businessApplication.findUnique({
      where: { id: applicationId },
      include: { applicant: true }
    });
    
    await tx.businessApplication.update({
      where: { id: applicationId },
      data: {
        status: finalStatus,
        finalDecision: decision,
        finalDecisionReason: reason,
      }
    });

    await tx.auditLog.create({
      data: {
        actorUserId: officerId,
        action: 'FINAL_DECISION',
        entityType: 'BusinessApplication',
        entityId: applicationId,
        ipAddress,
        newValue: { decision, reason, status: finalStatus },
      }
    });

    // Send notification to business owner
    if (decision === 'APPROVED') {
      await createNotification({
        recipientId: app.applicantId,
        title: 'Baga Gammadde! Maqaan Daldalaa Mirkana\'e',
        message: `Iyyatni kee ${app.applicationNumber} (${app.proposedBusinessName}) mirkana\'e. Sababni: ${reason}`,
        type: NOTIFICATION_TYPE.APPLICATION_APPROVED,
        applicationId,
        tx,
      });
    } else {
      await createNotification({
        recipientId: app.applicantId,
        title: 'Iyyatni Didame',
        message: `Iyyatni kee ${app.applicationNumber} (${app.proposedBusinessName}) dide. Sababni: ${reason}`,
        type: NOTIFICATION_TYPE.PERMISSION_REJECTED,
        applicationId,
        tx,
      });
    }

    return { success: true, status: finalStatus };
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
  getReviewedApplications,
  updateApplicationStatus,
  acceptApplication,
  rejectApplication,
  sendFinalDecision,
  makeFinalDecision,
};
