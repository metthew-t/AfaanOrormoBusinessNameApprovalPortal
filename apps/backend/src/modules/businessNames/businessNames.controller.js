// apps/backend/src/modules/businessNames/businessNames.controller.js

const { validateBusinessName } = require('./businessNames.service');
const { writeAuditLog, getIpAddress } = require('../auditLogs/auditLog.service');

/** POST /api/business-names/validate */
async function validate(req, res, next) {
  try {
    const { proposedName, excludeApplicationId } = req.body;

    if (!proposedName) {
      return res.status(400).json({
        success: false,
        message: 'Maqaan daldalaa galchi.',
        errors: [{ field: 'proposedName', message: 'Maqaan barbaachisaa dha.' }],
      });
    }

    const result = await validateBusinessName(proposedName, excludeApplicationId || null);

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: 'BUSINESS_NAME_VALIDATED',
      entityType: 'BusinessName',
      newValue: { proposedName, valid: result.valid, checks: result.checks },
      ipAddress: getIpAddress(req),
    });

    return res.json({
      success: true,
      message: result.valid ? 'Maqaan fudhatama.' : 'Maqaan fudhachuu hin danda\'amu.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { validate };
