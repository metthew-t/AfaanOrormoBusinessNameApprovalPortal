// apps/backend/src/modules/notifications/notification.service.js
// Creates in-app notifications. Never throws to avoid breaking business flows.

const prisma = require('../../config/database');
const { NOTIFICATION_TYPE } = require('../../../../../shared/constants/statuses');

/**
 * Creates a notification for a recipient.
 * @param {object} params
 * @param {number} params.recipientId
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} params.type - NOTIFICATION_TYPE value
 * @param {number|null} params.relatedEntityId
 * @param {number|null} params.applicationId
 * @param {import('@prisma/client').PrismaClient} [params.tx] - optional transaction client
 */
async function createNotification({
  recipientId,
  title,
  message,
  type,
  relatedEntityId = null,
  applicationId = null,
  tx = null,
}) {
  const client = tx || prisma;
  try {
    await client.notification.create({
      data: {
        recipientId,
        title,
        message,
        type,
        relatedEntityId,
        applicationId,
      },
    });
  } catch (err) {
    console.error('[Notification] Failed to create notification:', err.message);
  }
}

module.exports = { createNotification, NOTIFICATION_TYPE };
