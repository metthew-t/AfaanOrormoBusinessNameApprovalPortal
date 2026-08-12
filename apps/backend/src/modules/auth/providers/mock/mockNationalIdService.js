// apps/backend/src/modules/auth/providers/mock/mockNationalIdService.js
// Mock National ID Verification Service for development.
// Swap for real provider via NATIONAL_ID_PROVIDER env var — no code change at call sites.

/**
 * Simulates national ID verification.
 * In dev mode: any 10+ character ID returns VERIFIED.
 * IDs starting with "FAIL" return FAILED.
 *
 * @param {{ nationalIdNumber: string, userId: number, applicationId?: number }} input
 * @returns {Promise<{ status: 'VERIFIED'|'FAILED'|'PENDING', referenceId?: string }>}
 */
async function verifyIdentity({ nationalIdNumber, userId, applicationId }) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 200));

  if (!nationalIdNumber || nationalIdNumber.length < 6) {
    return { status: 'FAILED', referenceId: null };
  }

  if (nationalIdNumber.toUpperCase().startsWith('FAIL')) {
    return { status: 'FAILED', referenceId: `MOCK-FAIL-${Date.now()}` };
  }

  return {
    status: 'VERIFIED',
    referenceId: `MOCK-${userId}-${Date.now()}`,
  };
}

module.exports = { verifyIdentity };
