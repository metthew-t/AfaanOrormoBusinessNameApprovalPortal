// apps/backend/src/modules/notifications/notification.controller.js
// Authenticated user's own notifications

const prisma = require('../../config/database');

/** GET /api/notifications */
async function listNotifications(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where = { recipientId: req.user.id };
    if (req.query.unread === 'true') where.isRead = false;

    const [total, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Beeksisawwan argaman.',
      data: {
        notifications,
        unreadCount: await prisma.notification.count({
          where: { recipientId: req.user.id, isRead: false },
        }),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/notifications/:id/read */
async function markRead(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification || notification.recipientId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Beeksisni hin argamne.', errors: [] });
    }

    await prisma.notification.update({ where: { id }, data: { isRead: true } });

    return res.json({ success: true, message: 'Beeksisni dubbifame.', data: {} });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/notifications/read-all */
async function markAllRead(req, res, next) {
  try {
    await prisma.notification.updateMany({
      where: { recipientId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'Beeksisawwan hundi dubbifaman.', data: {} });
  } catch (err) {
    next(err);
  }
}

module.exports = { listNotifications, markRead, markAllRead };
