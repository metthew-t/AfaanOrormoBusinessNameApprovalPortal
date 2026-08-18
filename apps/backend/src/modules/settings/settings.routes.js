const express = require('express');
const { getSettings, bulkUpdate } = require('./settings.controller');
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../../shared/constants/roles');

const router = express.Router();

// Publicly readable (accessible to all authenticated users)
router.get('/', authenticateJWT, getSettings);

// Admin only to update
router.put('/bulk', authenticateJWT, authorizeRoles(ROLES.ADMIN), bulkUpdate);

module.exports = router;
