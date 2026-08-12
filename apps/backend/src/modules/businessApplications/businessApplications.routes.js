// apps/backend/src/modules/businessApplications/businessApplications.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const validate = require('../../middleware/validate');
const { upload } = require('../../config/multer');
const { ROLES } = require('../../../../shared/constants/roles');
const controller = require('./businessApplications.controller');
const {
  createApplicationValidator,
  updateApplicationValidator,
  correctionValidator,
} = require('./businessApplications.validators');

const ALL_OFFICERS = [
  ROLES.FINANCIAL_OFFICER,
  ROLES.LANGUAGE_OFFICER,
  ROLES.SENIOR_OFFICER,
  ROLES.ADMIN,
];

router.use(authenticateJWT);

// BUSINESS_OWNER creates
router.post(
  '/',
  authorizeRoles(ROLES.BUSINESS_OWNER),
  createApplicationValidator,
  validate,
  controller.createApplication
);

// List — owner sees own; officers see scoped
router.get(
  '/',
  authorizeRoles(ROLES.BUSINESS_OWNER, ...ALL_OFFICERS),
  controller.listApplications
);

// Single application detail
router.get(
  '/:id',
  authorizeRoles(ROLES.BUSINESS_OWNER, ...ALL_OFFICERS),
  controller.getApplication
);

// Update DRAFT
router.put(
  '/:id',
  authorizeRoles(ROLES.BUSINESS_OWNER),
  updateApplicationValidator,
  validate,
  controller.updateApplication
);

// Submit
router.post(
  '/:id/submit',
  authorizeRoles(ROLES.BUSINESS_OWNER),
  controller.submitApplication
);

// Submit correction
router.post(
  '/:id/correction',
  authorizeRoles(ROLES.BUSINESS_OWNER),
  correctionValidator,
  validate,
  controller.submitCorrection
);

// Timeline
router.get(
  '/:id/timeline',
  authorizeRoles(ROLES.BUSINESS_OWNER, ...ALL_OFFICERS),
  controller.getTimeline
);

// Document upload
router.post(
  '/:id/documents',
  authorizeRoles(ROLES.BUSINESS_OWNER),
  upload.single('document'),
  controller.uploadDocument
);

// Document download (authenticated)
router.get(
  '/:id/documents/:docId',
  authorizeRoles(ROLES.BUSINESS_OWNER, ...ALL_OFFICERS),
  controller.downloadDocument
);

module.exports = router;
