// apps/backend/src/modules/commercial/commercial.controller.js
// Commercial Office controller — handles /api/commercial/* endpoints

const service = require('./commercial.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');

async function getStats(req, res, next) {
  try {
    const stats = await service.getStats();
    return res.json({ success: true, data: stats });
  } catch (err) { next(err); }
}

async function getQueue(req, res, next) {
  try {
    const data = await service.getQueue();
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

async function getReviewDetail(req, res, next) {
  try {
    const data = await service.getReviewDetail(req.params.id);
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

async function approvePermit(req, res, next) {
  try {
    // Frontend sends { comment } — map to reviewComment expected by service
    const body = { reviewComment: req.body.comment || req.body.reviewComment || '' };
    const result = await service.approvePermit(req.params.id, req.user.id, body, getIpAddress(req));
    return res.json({ success: true, message: 'Hayyamni mirkana\'e.', data: result });
  } catch (err) { next(err); }
}

async function rejectPermit(req, res, next) {
  try {
    const body = { reviewComment: req.body.reason || req.body.reviewComment || '' };
    const result = await service.rejectPermit(req.params.id, req.user.id, body, getIpAddress(req));
    return res.json({ success: true, message: 'Hayyamni dide.', data: result });
  } catch (err) { next(err); }
}

async function requestCorrection(req, res, next) {
  try {
    const body = { reviewComment: req.body.correctionNotes || req.body.reviewComment || req.body.reason || '' };
    const result = await service.requestCorrection(req.params.id, req.user.id, body, getIpAddress(req));
    return res.json({ success: true, message: 'Sirreessaan gaafatame.', data: result });
  } catch (err) { next(err); }
}

module.exports = { getStats, getQueue, getReviewDetail, approvePermit, rejectPermit, requestCorrection };
