// apps/backend/src/modules/businessNames/businessNames.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');
const controller = require('./businessNames.controller');

// Validate — BUSINESS_OWNER can call this; optionally accessible to system
router.post('/validate', authenticateJWT, authorizeRoles(ROLES.BUSINESS_OWNER), controller.validate);

module.exports = router;
