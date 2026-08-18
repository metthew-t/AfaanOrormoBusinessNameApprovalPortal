// apps/backend/src/modules/permissions/permissions.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');
const controller = require('./permissions.controller');

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.FINANCIAL_OFFICER, ROLES.ADMIN));

router.get('/', controller.listPermissions);
router.get('/:id', controller.getPermission);
router.post('/:id/approve', controller.approvePermission);
router.post('/:id/reject', controller.rejectPermission);
router.post('/:id/request-correction', controller.requestCorrection);

module.exports = router;
