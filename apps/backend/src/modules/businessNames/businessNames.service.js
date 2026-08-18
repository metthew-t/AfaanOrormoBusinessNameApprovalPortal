// apps/backend/src/modules/businessNames/businessNames.service.js
// Implements the 6-step automatic validation per spec §6.
// All checks use the shared normalizeBusinessName() — never re-implemented.

const prisma = require('../../config/database');
const {
  normalizeBusinessName,
  validateBusinessNameFormat,
} = require('../../../../../shared/utils/normalizeBusinessName');

/**
 * Runs all 6 automatic validation checks against a proposed business name.
 *
 * @param {string} proposedName - Raw input from user
 * @returns {Promise<{
 *   valid: boolean,
 *   normalizedName: string,
 *   checks: {
 *     invalidLength: boolean,
 *     invalidCharacters: boolean,
 *     exactDuplicate: boolean,
 *     normalizedDuplicate: boolean,
 *     pendingDuplicate: boolean,
 *     reservedTerm: boolean,
 *   },
 *   reasons: string[]
 * }>}
 */
async function validateBusinessName(proposedName, excludeApplicationId = null) {
  const reasons = [];
  const checks = {
    invalidLength: false,
    invalidCharacters: false,
    exactDuplicate: false,
    normalizedDuplicate: false,
    pendingDuplicate: false,
    reservedTerm: false,
  };

  // Step 1 & 2: Format validation (empty, length, invalid characters)
  const formatResult = validateBusinessNameFormat(proposedName);
  if (!formatResult.valid) {
    // Determine which check failed
    if (!proposedName || proposedName.trim().length === 0) {
      checks.invalidLength = true;
    } else if (proposedName.trim().length < 2 || proposedName.trim().length > 100) {
      checks.invalidLength = true;
    } else {
      checks.invalidCharacters = true;
    }
    return {
      valid: false,
      normalizedName: '',
      checks,
      reasons: formatResult.reasons,
    };
  }

  // Step 3: Normalize
  const normalizedName = normalizeBusinessName(proposedName);

  // Step 4: Exact/normalized duplicate — against business_name_registry
  const registryMatch = await prisma.businessNameRegistry.findFirst({
    where: { normalizedName },
  });

  if (registryMatch) {
    if (registryMatch.originalName.toLowerCase() === proposedName.toLowerCase()) {
      checks.exactDuplicate = true;
      reasons.push('Maqaan kun sirumatti kanaan dura galmaa\'ee jira.');
    } else {
      checks.normalizedDuplicate = true;
      reasons.push(`Maqaan kun kan kanaan dura galmaa'e "${registryMatch.originalName}" wajjiin tokko.`);
    }
  }

  // Step 5: Pending duplicate — same normalized name in another active application
  const pendingWhere = {
    normalizedBusinessName: normalizedName,
    status: {
      in: [
        'SUBMITTED',
        'PERMISSION_PENDING',
        'PERMISSION_CORRECTION_REQUIRED',
        'LANGUAGE_REVIEW_PENDING',
        'LANGUAGE_CORRECTION_REQUIRED',
      ],
    },
  };
  
  if (excludeApplicationId) {
    pendingWhere.id = { not: parseInt(excludeApplicationId, 10) };
  }

  const pendingMatch = await prisma.businessApplication.findFirst({
    where: pendingWhere,
  });

  if (pendingMatch) {
    checks.pendingDuplicate = true;
    reasons.push('Maqaan kun iyyata biraa keessatti adeemsarra jira.');
  }

  // Step 6: Reserved/prohibited term
  const reservedMatch = await prisma.reservedTerm.findFirst({
    where: { normalizedTerm: normalizedName },
  });

  if (!reservedMatch) {
    // Check if any reserved term is contained within the name
    const allReserved = await prisma.reservedTerm.findMany({
      select: { normalizedTerm: true, term: true },
    });
    const containsReserved = allReserved.find((r) => normalizedName.includes(r.normalizedTerm));
    if (containsReserved) {
      checks.reservedTerm = true;
      reasons.push(`Maqaan kun jechalee dhorkaa "${containsReserved.term}" qabatee jira.`);
    }
  } else {
    checks.reservedTerm = true;
    reasons.push('Maqaan kun jecha dhorkaadhaan wal qaba.');
  }

  const valid = !Object.values(checks).some(Boolean);

  return { valid, normalizedName, checks, reasons };
}

module.exports = { validateBusinessName };
