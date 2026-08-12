/**
 * shared/utils/normalizeBusinessName.js
 * AOBNAP — THE single canonical normalization function (spec §6)
 *
 * This function MUST be used for:
 *  - Application validation
 *  - Historical import
 *  - Master registry writes
 *  - Public search
 *  - Duplicate checking
 *  - Reserved term checking
 *
 * NEVER re-implement this logic elsewhere. Import from this file.
 *
 * Algorithm (in order per spec §6):
 *  1. Unicode-normalize to NFC
 *  2. Trim leading/trailing whitespace
 *  3. Collapse internal whitespace to single space
 *  4. Case-fold to lowercase
 *  5. Normalize punctuation (remove/replace per Afaan Oromo rules)
 *  6. Remove disallowed characters (allowlist: Afaan Oromo letters, space, hyphen)
 */

/**
 * Allowed character pattern for Afaan Oromo business names.
 *
 * Afaan Oromo uses Latin script with special characters.
 * Allowed: Unicode letters (covers Latin extended for ʼ, etc.), digits, space, hyphen.
 * Configurable: update the regex if the Afaan Oromo Office confirms wider/narrower set.
 *
 * @type {RegExp}
 */
const ALLOWED_CHARS_PATTERN = /[^\p{L}\p{N}\s\-']/gu;

/**
 * Minimum and maximum name length (configurable).
 */
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

/**
 * Normalizes a business name to a canonical form for comparison and registry storage.
 *
 * @param {string} name - Raw business name input
 * @returns {string} - Normalized business name
 */
function normalizeBusinessName(name) {
  if (typeof name !== 'string') return '';

  return name
    // Step 1: Unicode NFC normalization
    .normalize('NFC')
    // Step 2: Trim
    .trim()
    // Step 3: Collapse internal whitespace
    .replace(/\s+/g, ' ')
    // Step 4: Case-fold to lowercase
    .toLowerCase()
    // Step 5: Normalize punctuation — normalize apostrophes/right-single-quotes to standard
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    // Step 6: Remove disallowed characters
    .replace(ALLOWED_CHARS_PATTERN, '')
    // Final trim after character removal
    .trim();
}

/**
 * Validates a raw business name against all static rules (length, characters).
 * Does NOT check database (duplicates, reserved terms) — that is the caller's job.
 *
 * @param {string} name - Raw business name input
 * @returns {{ valid: boolean, reasons: string[] }}
 */
function validateBusinessNameFormat(name) {
  const reasons = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, reasons: ['Maqaan gahaa duwwaa ta\'uu hin danda\'u'] };
  }

  const trimmed = name.trim();

  if (trimmed.length < NAME_MIN_LENGTH) {
    reasons.push(`Maqaan hir\'ata ${NAME_MIN_LENGTH} qubee qabaachuu qaba`);
  }

  if (trimmed.length > NAME_MAX_LENGTH) {
    reasons.push(`Maqaan qubee ${NAME_MAX_LENGTH} ol ta\'uu hin danda\'u`);
  }

  // Check for invalid characters before normalization
  const invalidCharsPattern = /[^\p{L}\p{N}\s\-'\u2018\u2019\u02BC]/gu;
  if (invalidCharsPattern.test(trimmed)) {
    reasons.push('Maqaan qubee eeyyamamoo hin taane qabatee jira');
  }

  return { valid: reasons.length === 0, reasons };
}

module.exports = {
  normalizeBusinessName,
  validateBusinessNameFormat,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  ALLOWED_CHARS_PATTERN,
};
