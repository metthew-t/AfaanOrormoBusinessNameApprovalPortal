// apps/backend/src/modules/auth/auth.routes.js

const express = require('express');
const router = express.Router();
const { authLimiter } = require('../../middleware/rateLimiter');
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const validate = require('../../middleware/validate');
const controller = require('./auth.controller');
const { registerValidator, loginValidator, verifyNationalIdValidator } = require('./auth.validators');
const { ROLES } = require('../../../../shared/constants/roles');

router.post('/register', authLimiter, registerValidator, validate, controller.register);
router.post('/login', authLimiter, loginValidator, validate, controller.login);
router.post('/logout', authenticateJWT, controller.logout);
router.post('/refresh', authLimiter, controller.refreshToken);
router.post(
  '/verify-national-id',
  authenticateJWT,
  authorizeRoles(ROLES.BUSINESS_OWNER),
  verifyNationalIdValidator,
  validate,
  controller.verifyNationalId
);
router.get('/me', authenticateJWT, controller.getMe);

module.exports = router;
