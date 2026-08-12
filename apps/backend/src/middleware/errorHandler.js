// apps/backend/src/middleware/errorHandler.js
// Global Express error handler — always returns standardized envelope.
// Never exposes raw stack traces to clients.

const env = require('../config/env');

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // Log internally
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (env.isDev) console.error(err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: `Faayiliin guddaa dha. Dheerina ${process.env.MAX_FILE_SIZE_MB || 10}MB ol hin ta'u.`,
      errors: [],
    });
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Galteen kun duraan jira (unique constraint).',
      errors: [],
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Galteen barbaadamu hin argamne.',
      errors: [],
    });
  }

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(422).json({
      success: false,
      message: 'Galchi sirrii miti.',
      errors: err.errors || [],
    });
  }

  // HTTP errors with explicit status
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'Dhaabbannaa hin beekamne.',
      errors: [],
    });
  }

  // Default: 500 Internal Server Error
  return res.status(500).json({
    success: false,
    message: env.isDev ? err.message : 'Dogoggora sirna keessaa. Yeroo muraasa booda irra deebi\'ii yaalii.',
    errors: [],
  });
}

module.exports = errorHandler;
