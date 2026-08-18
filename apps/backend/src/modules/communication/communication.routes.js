const express = require('express');
const controller = require('./communication.controller');
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');

const router = express.Router();

// All routes require FINANCIAL_OFFICER role (mapped to Communication Biro in frontend)
router.use(authenticateJWT, authorizeRoles(ROLES.FINANCIAL_OFFICER));

router.get('/dashboard/stats', controller.getStats);
router.get('/applications', controller.getApplications);
router.get('/applications/:id', controller.getApplicationDetail);
router.post('/applications/:id/route', controller.routeApplication);

router.get('/messages', controller.getMessages);
router.post('/messages', controller.sendMessage);
router.patch('/messages/:id/read', controller.markMessageRead);

router.get('/from-commercial', controller.getFromCommercial);
router.get('/from-turizm', controller.getFromTurizm);

router.patch('/applications/:id/status', controller.updateApplicationStatus);
router.post('/applications/accept', controller.acceptApplication);
router.post('/applications/reject', controller.rejectApplication);
router.post('/final-decision', controller.sendFinalDecision);

module.exports = router;
