// apps/backend/src/middleware/validate.js
// Runs express-validator results and returns 422 on failure

const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results.
 * Place after validation chains, before the controller handler.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Galchi sirrii miti.',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

module.exports = validate;
