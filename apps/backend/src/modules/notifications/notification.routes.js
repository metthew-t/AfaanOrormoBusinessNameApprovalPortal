// apps/backend/src/modules/notifications/notification.routes.js

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJWT');
const { listNotifications, markRead, markAllRead, getUnreadCount } = require('./notification.controller');

router.use(authenticateJWT);

router.get('/', listNotifications);
router.get('/unread-count', getUnreadCount);      // frontend calls /notifications/unread-count
router.patch('/read-all', markAllRead);            // legacy path
router.patch('/mark-all-read', markAllRead);       // frontend calls /notifications/mark-all-read
router.patch('/:id/read', markRead);

module.exports = router;
