// apps/backend/src/modules/auth/nationalIdService.js
// Abstraction: resolves to Mock or Real provider per NATIONAL_ID_PROVIDER env var.
// Call sites import this — never import a provider directly.

const env = require('../../config/env');

let provider;

if (env.NATIONAL_ID_PROVIDER === 'MOCK' || env.isDev) {
  provider = require('./providers/mock/mockNationalIdService');
  console.log('[NationalID] Using MOCK provider');
} else {
  // Real provider: implement RealNationalIdService with same interface
  // and set NATIONAL_ID_PROVIDER_URL / NATIONAL_ID_PROVIDER_KEY in env
  try {
    provider = require('./providers/real/realNationalIdService');
    console.log('[NationalID] Using REAL provider');
  } catch {
    console.warn('[NationalID] Real provider not found, falling back to MOCK');
    provider = require('./providers/mock/mockNationalIdService');
  }
}

/**
 * @param {{ nationalIdNumber: string, userId: number, applicationId?: number }} input
 * @returns {Promise<{ status: 'VERIFIED'|'FAILED'|'PENDING', referenceId?: string }>}
 */
async function verifyIdentity(input) {
  return provider.verifyIdentity(input);
}

module.exports = { verifyIdentity };
