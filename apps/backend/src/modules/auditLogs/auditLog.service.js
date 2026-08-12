// apps/backend/src/modules/auditLogs/auditLog.service.js
// Cross-cutting audit log writer. Called by all state-changing handlers.

const prisma = require('../../config/database');

/**
 * Records an audit log entry. Never throws — audit failure must not break business flow.
 *
 * @param {object} params
 * @param {number|null} params.actorUserId
 * @param {string} params.action
 * @param {string} params.entityType
 * @param {number|null} params.entityId
 * @param {object|null} params.previousValue
 * @param {object|null} params.newValue
 * @param {string|null} params.ipAddress
 */
async function writeAuditLog({
  actorUserId = null,
  action,
  entityType,
  entityId = null,
  previousValue = null,
  newValue = null,
  ipAddress = null,
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId,
        action,
        entityType,
        entityId,
        previousValue,
        newValue,
        ipAddress,
      },
    });
  } catch (err) {
    // Log internally but never propagate
    console.error('[AuditLog] Failed to write audit log:', err.message, { action, entityType, entityId });
  }
}

/**
 * Helper: get IP from express request
 * @param {import('express').Request} req
 * @returns {string}
 */
function getIpAddress(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * @param {import('prisma').PrismaClient} tx - prisma or transaction client
 */
async function writeAuditLogInTransaction(tx, {
  actorUserId = null,
  action,
  entityType,
  entityId = null,
  previousValue = null,
  newValue = null,
  ipAddress = null,
}) {
  return tx.auditLog.create({
    data: {
      actorUserId,
      action,
      entityType,
      entityId,
      previousValue,
      newValue,
      ipAddress,
    },
  });
}

module.exports = { writeAuditLog, writeAuditLogInTransaction, getIpAddress };
