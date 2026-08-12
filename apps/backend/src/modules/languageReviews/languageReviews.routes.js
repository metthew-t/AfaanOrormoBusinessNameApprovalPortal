// apps/backend/src/modules/languageReviews/languageReviews.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const authorizeRoles = require('../../middleware/authorizeRoles');
const { ROLES } = require('../../../../shared/constants/roles');
const controller = require('./languageReviews.controller');

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.LANGUAGE_OFFICER, ROLES.ADMIN));

router.get('/', controller.listLanguageReviews);
router.get('/:id', controller.getLanguageReview);
router.post('/:id/approve', controller.approveLanguageReview);
router.post('/:id/reject', controller.rejectLanguageReview);
router.post('/:id/request-correction', controller.requestLRCorrection);

module.exports = router;
