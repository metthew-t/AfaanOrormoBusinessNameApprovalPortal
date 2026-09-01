// apps/backend/src/modules/turizm/turizm.routes.js
// Routes for Waajira Aadaaf Turizimii — mounted at /api/turizm

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');
const controller = require('./turizm.controller');

// All routes require LANGUAGE_OFFICER role (Waajira Aadaaf Turizimii)
router.use(authenticateJWT, authorizeRoles(ROLES.LANGUAGE_OFFICER, ROLES.ADMIN));

router.get('/dashboard/stats', controller.getStats);
router.get('/reviews', controller.getQueue);
router.get('/reviews/:id', controller.getReviewDetail);
router.post('/reviews/:id/approve', controller.approveReview);
router.post('/reviews/:id/reject', controller.rejectReview);
router.post('/reviews/:id/request-correction', controller.requestCorrection);

module.exports = router;
