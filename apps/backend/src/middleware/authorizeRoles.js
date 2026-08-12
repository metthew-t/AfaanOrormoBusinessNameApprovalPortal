// apps/backend/src/middleware/authorizeRoles.js
// Role-based access control middleware. Must be used AFTER authenticateJWT.

/**
 * Returns middleware that allows only the specified roles.
 *
 * Usage:
 *   router.post('/route', authenticateJWT, authorizeRoles('ADMIN', 'FINANCIAL_OFFICER'), handler)
 *
 * @param {...string} allowedRoles
 * @returns {import('express').RequestHandler}
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Eenyummaa mirkaneessuu hin dandeenye.',
        errors: [],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Hojii kana raawwachuuf hayyama hin qabdu.',
        errors: [],
      });
    }

    next();
  };
}

module.exports = authorizeRoles;
