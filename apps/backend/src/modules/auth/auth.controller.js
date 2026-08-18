// apps/backend/src/modules/auth/auth.controller.js

const authService = require('./auth.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');

async function register(req, res, next) {
  try {
    const { fullName, email, phoneNumber, password, nationalIdRef } = req.body;
    const result = await authService.register(
      { fullName, email, phoneNumber, password, nationalIdRef },
      getIpAddress(req)
    );
    return res.status(201).json({ success: true, message: 'Galmaa\'insi milkaa\'e.', data: result });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password }, getIpAddress(req));
    return res.json({ success: true, message: 'Seenaan milkaa\'e.', data: result });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT — client discards token. Optionally, add a blocklist here later.
  return res.json({ success: true, message: 'Ba\'uu milkaa\'e.', data: {} });
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token barbaachisaa dha.', errors: [] });
    }
    const result = await authService.refreshAccessToken(refreshToken);
    return res.json({ success: true, message: 'Token haaromfame.', data: result });
  } catch (err) {
    next(err);
  }
}

async function verifyNationalId(req, res, next) {
  try {
    const { nationalIdNumber, applicationId } = req.body;
    const result = await authService.verifyNationalId(
      { nationalIdNumber, userId: req.user.id, applicationId: applicationId || null },
      getIpAddress(req)
    );
    return res.json({
      success: true,
      message: result.status === 'VERIFIED' ? 'Eenyummaan mirkanaa\'e.' : 'Eenyummaan mirkanaa\'uu dideera.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return res.json({ success: true, message: 'Fayyadamaa argame.', data: user });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Jecha icciitii galchi.', errors: [] });
    }
    const result = await authService.changePassword(
      { userId: req.user.id, currentPassword, newPassword },
      getIpAddress(req)
    );
    return res.json({ success: true, message: result.message, data: {} });
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const { fullName, phoneNumber } = req.body;
    const user = await authService.updateProfile(
      { userId: req.user.id, fullName, phoneNumber },
      getIpAddress(req)
    );
    return res.json({ success: true, message: 'Profile haaromfame.', data: user });
  } catch (err) { next(err); }
}

module.exports = { register, login, logout, refreshToken, verifyNationalId, getMe, changePassword, updateProfile };
