/**
 * shared/constants/roles.js
 * AOBNAP — Centralized role constants
 * Single source of truth for all role names used across backend and database.
 */

const ROLES = Object.freeze({
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  FINANCIAL_OFFICER: 'FINANCIAL_OFFICER',
  LANGUAGE_OFFICER: 'LANGUAGE_OFFICER',
  SENIOR_OFFICER: 'SENIOR_OFFICER',
  ADMIN: 'ADMIN',
});

module.exports = { ROLES };
