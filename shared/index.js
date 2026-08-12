// shared/index.js — barrel export for shared layer
const { ROLES } = require('./constants/roles');
const {
  APPLICATION_STATUS,
  VALID_TRANSITIONS,
  PERMISSION_STATUS,
  LANGUAGE_REVIEW_STATUS,
  IDENTITY_VERIFICATION_STATUS,
  DOCUMENT_TYPE,
  REGISTRY_SOURCE,
  NOTIFICATION_TYPE,
  isValidTransition,
} = require('./constants/statuses');
const {
  normalizeBusinessName,
  validateBusinessNameFormat,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
} = require('./utils/normalizeBusinessName');

module.exports = {
  ROLES,
  APPLICATION_STATUS,
  VALID_TRANSITIONS,
  PERMISSION_STATUS,
  LANGUAGE_REVIEW_STATUS,
  IDENTITY_VERIFICATION_STATUS,
  DOCUMENT_TYPE,
  REGISTRY_SOURCE,
  NOTIFICATION_TYPE,
  isValidTransition,
  normalizeBusinessName,
  validateBusinessNameFormat,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
};
