// apps/backend/src/middleware/authenticateJWT.js
// Validates Bearer JWT access token. Attaches req.user on success.

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/database');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Eenyummaa mirkaaneessaa. Token hin argamne.',
      errors: [],
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Fetch fresh user — ensures deactivated accounts are rejected immediately
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Fayyadamaan hin argamne ykn hojii irraa dhaabame.',
        errors: [],
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
      roleId: user.roleId,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token yeroon isaa dabree jira. Deebi\'ii seeni.',
        errors: [],
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token sirrii miti.',
      errors: [],
    });
  }
}

module.exports = authenticateJWT;
