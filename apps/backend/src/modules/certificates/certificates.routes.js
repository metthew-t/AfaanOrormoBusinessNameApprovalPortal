// apps/backend/src/modules/certificates/certificates.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../shared/constants/roles');
const controller = require('./certificates.controller');

const AUTHORIZED = [ROLES.BUSINESS_OWNER, ROLES.FINANCIAL_OFFICER, ROLES.LANGUAGE_OFFICER, ROLES.SENIOR_OFFICER, ROLES.ADMIN];

router.use(authenticateJWT);
router.use(authorizeRoles(...AUTHORIZED));

router.get('/', controller.listCertificates);
router.get('/:id', controller.getCertificate);
router.get('/:id/download', controller.downloadCertificate);
router.get('/:id/qr', controller.getQrCode);

module.exports = router;
