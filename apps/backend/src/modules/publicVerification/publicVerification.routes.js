// apps/backend/src/modules/publicVerification/publicVerification.routes.js
// No authentication required

const express = require('express');
const router = express.Router();
const { publicSearchLimiter } = require('../../middleware/rateLimiter');
const controller = require('./publicVerification.controller');

router.get('/business-names/search', publicSearchLimiter, controller.searchBusinessNames);
router.get('/certificates/verify/:approvalNumber', publicSearchLimiter, controller.verifyCertificate);

module.exports = router;
