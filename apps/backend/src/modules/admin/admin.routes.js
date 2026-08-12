// apps/backend/src/modules/admin/admin.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../shared/constants/roles');
const adminController = require('./admin.controller');
const { listAuditLogs } = require('../auditLogs/auditLog.controller');
const multer = require('multer');

// CSV import uses temp storage (not the main upload config)
const csvUpload = multer({ dest: 'temp_imports/', limits: { fileSize: 50 * 1024 * 1024 } });

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.ADMIN));

// ─── User Management ──────────────────────────────────────────────────────
router.get('/users', adminController.listUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);

// ─── Business Categories ──────────────────────────────────────────────────
router.get('/business-categories', adminController.listCategories);
router.post('/business-categories', adminController.createCategory);
router.patch('/business-categories/:id', adminController.updateCategory);

// ─── Reserved Terms ──────────────────────────────────────────────────────
router.get('/reserved-terms', adminController.listReservedTerms);
router.post('/reserved-terms', adminController.createReservedTerm);
router.delete('/reserved-terms/:id', adminController.deleteReservedTerm);

// ─── Historical Business Names ──────────────────────────────────────────
router.get('/historical-names', adminController.listHistoricalNames);
router.post('/historical-names', adminController.addHistoricalName);
router.post('/historical-names/import', csvUpload.single('file'), adminController.importHistoricalNames);

// ─── Audit Logs ─────────────────────────────────────────────────────────
router.get('/audit-logs', listAuditLogs);

module.exports = router;
