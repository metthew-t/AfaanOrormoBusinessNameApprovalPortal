// apps/backend/src/modules/turizm/turizm.service.js
// Addaf Turizm Biro — language review from the frontend's /api/turizm/* perspective.
// Wraps the underlying languageReviews service and adds turizm-specific stats.

const prisma = require('../../config/database');
const {
  APPLICATION_STATUS,
  LANGUAGE_REVIEW_STATUS,
  TURIZM_STATUS,
} = require('../../../../../shared/constants/statuses');
const languageReviewService = require('../languageReviews/languageReviews.service');

/**
 * Dashboard stats for the Turizm Biro officer.
 */
async function getStats() {
  const [pending, approved, rejected, correctionRequired] = await Promise.all([
    prisma.languageReview.count({ where: { status: LANGUAGE_REVIEW_STATUS.PENDING } }),
    prisma.languageReview.count({ where: { status: LANGUAGE_REVIEW_STATUS.APPROVED } }),
    prisma.languageReview.count({ where: { status: LANGUAGE_REVIEW_STATUS.REJECTED } }),
    prisma.languageReview.count({ where: { status: LANGUAGE_REVIEW_STATUS.CORRECTION_REQUIRED } }),
  ]);
  return { pending, approved, rejected, correctionRequired };
}

/**
 * Returns applications queued for Turizm language review.
 * Maps from the languageReview DB rows to the shape the frontend expects.
 */
async function getQueue() {
  const { reviews } = await languageReviewService.listLanguageReviews({ limit: 100 });

  return reviews.map(r => ({
    id: r.id.toString(),
    applicationNumber: r.application.applicationNumber,
    businessName: r.application.proposedBusinessName,
    owner: {
      fullName: r.application.applicant.fullName,
      email: r.application.applicant.email,
    },
    category: r.application.businessCategory?.name || '',
    description: r.application.businessDescription,
    address: r.application.businessAddress,
    receivedAt: r.createdAt,
    status: r.application.status,
    turizmStatus: r.status,
    timeline: [
      { event: 'Application Submitted', timestamp: r.application.createdAt },
      { event: 'Assigned to Language Review', timestamp: r.createdAt },
    ],
  }));
}

/**
 * Returns a single application for Turizm review by languageReview id.
 */
async function getReviewDetail(reviewId) {
  const review = await languageReviewService.getLanguageReview(reviewId);
  return {
    id: review.id.toString(),
    applicationNumber: review.application.applicationNumber,
    businessName: review.application.proposedBusinessName,
    owner: {
      fullName: review.application.applicant.fullName,
      email: review.application.applicant.email,
    },
    category: review.application.businessCategory?.name || '',
    description: review.application.businessDescription,
    address: review.application.businessAddress,
    receivedAt: review.createdAt,
    status: review.application.status,
    turizmStatus: review.status,
    reviewComment: review.reviewComment,
    timeline: [
      { event: 'Application Submitted', timestamp: review.application.createdAt },
      { event: 'Assigned to Language Review', timestamp: review.createdAt },
    ],
  };
}

module.exports = {
  getStats,
  getQueue,
  getReviewDetail,
  // Delegate action methods directly to the underlying service
  approveReview: languageReviewService.approveLanguageReview,
  rejectReview: languageReviewService.rejectLanguageReview,
  requestCorrection: languageReviewService.requestLRCorrection,
};
