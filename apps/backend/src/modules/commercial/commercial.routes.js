// apps/backend/src/modules/commercial/commercial.routes.js
// Routes for Commercial Office — mounted at /api/commercial

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');
const controller = require('./commercial.controller');

// All routes require SENIOR_OFFICER role (Commercial Office)
router.use(authenticateJWT, authorizeRoles(ROLES.SENIOR_OFFICER, ROLES.ADMIN));

router.get('/dashboard/stats', controller.getStats);
router.get('/reviews', controller.getQueue);
router.get('/reviews/:id', controller.getReviewDetail);
router.post('/reviews/:id/approve', controller.approvePermit);
router.post('/reviews/:id/reject', controller.rejectPermit);
router.post('/reviews/:id/request-correction', controller.requestCorrection);

module.exports = router;
