// apps/backend/src/modules/notifications/notification.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const { listNotifications, markRead, markAllRead } = require('./notification.controller');

router.use(authenticateJWT);

router.get('/', listNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

module.exports = router;
