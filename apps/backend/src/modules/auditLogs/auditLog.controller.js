// apps/backend/src/modules/auditLogs/auditLog.controller.js
// ADMIN-only: list audit logs with pagination and filters.

const prisma = require('../../config/database');

/**
 * GET /api/admin/audit-logs
 * Query params: page, limit, actorUserId, entityType, action, from, to
 */
async function listAuditLogs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.actorUserId) where.actorUserId = parseInt(req.query.actorUserId, 10);
    if (req.query.entityType) where.entityType = req.query.entityType;
    if (req.query.action) where.action = { contains: req.query.action };
    if (req.query.from || req.query.to) {
      where.createdAt = {};
      if (req.query.from) where.createdAt.gte = new Date(req.query.from);
      if (req.query.to) where.createdAt.lte = new Date(req.query.to);
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, fullName: true, email: true } },
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Seenaa hojii argame.',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAuditLogs };
