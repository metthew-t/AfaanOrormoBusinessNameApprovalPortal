// apps/backend/src/modules/commercial/commercial.service.js
// Commercial Office — permit review from the frontend's /api/commercial/* perspective.
// Wraps the underlying permissions service and adds commercial-specific stats.

const prisma = require('../../config/database');
const {
  PERMISSION_STATUS,
} = require('../../../../../shared/constants/statuses');
const permissionService = require('../permissions/permissions.service');

/**
 * Dashboard stats for the Commercial Office officer.
 */
async function getStats() {
  const [pending, approved, rejected, correctionRequired] = await Promise.all([
    prisma.businessPermission.count({ where: { status: PERMISSION_STATUS.PENDING } }),
    prisma.businessPermission.count({ where: { status: PERMISSION_STATUS.APPROVED } }),
    prisma.businessPermission.count({ where: { status: PERMISSION_STATUS.REJECTED } }),
    prisma.businessPermission.count({ where: { status: PERMISSION_STATUS.CORRECTION_REQUIRED } }),
  ]);
  return { pending, approved, rejected, correctionRequired };
}

/**
 * Returns applications in the commercial review queue.
 * Maps from BusinessPermission DB rows to the shape the frontend expects.
 */
async function getQueue() {
  const { permissions } = await permissionService.listPermissions({ limit: 100 });

  return permissions.map(p => ({
    id: p.id.toString(),
    applicationNumber: p.application.applicationNumber,
    businessName: p.application.proposedBusinessName,
    owner: {
      fullName: p.application.applicant.fullName,
      email: p.application.applicant.email,
      phone: p.application.applicant.phoneNumber || '',
    },
    category: p.application.businessCategory?.name || '',
    description: p.application.businessDescription,
    address: p.application.businessAddress,
    permissionDocument: p.document ? {
      fileName: p.document.originalFilename,
      fileSize: p.document.fileSize,
      uploadedAt: p.document.createdAt,
      url: '#',
    } : null,
    receivedAt: p.createdAt,
    status: p.application.status,
    commercialStatus: p.status,
    timeline: [
      { event: 'Application Submitted', timestamp: p.application.createdAt },
      { event: 'Assigned to Commercial Review', timestamp: p.createdAt },
    ],
  }));
}

/**
 * Returns a single application for commercial review by permission id.
 */
async function getReviewDetail(permissionId) {
  const permission = await permissionService.getPermission(permissionId);
  return {
    id: permission.id.toString(),
    applicationNumber: permission.application.applicationNumber,
    businessName: permission.application.proposedBusinessName,
    owner: {
      fullName: permission.application.applicant.fullName,
      email: permission.application.applicant.email,
      phone: permission.application.applicant.phoneNumber || '',
    },
    category: permission.application.businessCategory?.name || '',
    description: permission.application.businessDescription,
    address: permission.application.businessAddress,
    permissionDocument: permission.document ? {
      fileName: permission.document.originalFilename,
      fileSize: permission.document.fileSize,
      uploadedAt: permission.document.createdAt,
      url: '#',
    } : null,
    receivedAt: permission.createdAt,
    status: permission.application.status,
    commercialStatus: permission.status,
    reviewComment: permission.reviewComment,
    timeline: [
      { event: 'Application Submitted', timestamp: permission.application.createdAt },
      { event: 'Assigned to Commercial Review', timestamp: permission.createdAt },
    ],
  };
}

module.exports = {
  getStats,
  getQueue,
  getReviewDetail,
  // Delegate action methods directly to the underlying service
  approvePermit: permissionService.approvePermission,
  rejectPermit: permissionService.rejectPermission,
  requestCorrection: permissionService.requestCorrection,
};
