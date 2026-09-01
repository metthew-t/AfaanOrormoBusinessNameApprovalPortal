// apps/backend/src/modules/publicVerification/publicVerification.routes.js
// No authentication required

const express = require('express');
const router = express.Router();
const { publicSearchLimiter } = require('../../middleware/rateLimiter');
const controller = require('./publicVerification.controller');

router.get('/business-names/search', publicSearchLimiter, controller.searchBusinessNames);
router.get('/business-names', publicSearchLimiter, controller.searchBusinessNames);           // alias — frontend calls /public/business-names?q=...
router.get('/verify-certificate', publicSearchLimiter, controller.verifyCertificateByQuery); // frontend calls /public/verify-certificate?approvalNumber=X
router.get('/certificates/verify/:approvalNumber', publicSearchLimiter, controller.verifyCertificate);
router.get('/categories', publicSearchLimiter, require('../admin/admin.controller').listCategories);

module.exports = router;
