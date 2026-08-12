// apps/backend/src/modules/permissions/permissions.controller.js

const service = require('./permissions.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');
const { body } = require('express-validator');

async function listPermissions(req, res, next) {
  try {
    const result = await service.listPermissions(req.query);
    return res.json({ success: true, message: 'Hayyamawwan argaman.', data: result });
  } catch (err) { next(err); }
}

async function getPermission(req, res, next) {
  try {
    const permission = await service.getPermission(req.params.id);
    return res.json({ success: true, message: 'Hayyamni argame.', data: permission });
  } catch (err) { next(err); }
}

async function approvePermission(req, res, next) {
  try {
    const result = await service.approvePermission(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Hayyamni mirkana\'e.', data: result });
  } catch (err) { next(err); }
}

async function rejectPermission(req, res, next) {
  try {
    const result = await service.rejectPermission(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Hayyamni dide.', data: result });
  } catch (err) { next(err); }
}

async function requestCorrection(req, res, next) {
  try {
    const result = await service.requestCorrection(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Sirreessaan gaafatame.', data: result });
  } catch (err) { next(err); }
}

module.exports = { listPermissions, getPermission, approvePermission, rejectPermission, requestCorrection };
