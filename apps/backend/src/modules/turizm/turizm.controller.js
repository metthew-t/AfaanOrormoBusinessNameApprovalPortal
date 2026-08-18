// apps/backend/src/modules/turizm/turizm.controller.js
// Addaf Turizm Biro controller — handles /api/turizm/* endpoints

const service = require('./turizm.service');
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

async function approveReview(req, res, next) {
  try {
    const result = await service.approveReview(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Maqaan daldalaa mirkana\'e.', data: result });
  } catch (err) { next(err); }
}

async function rejectReview(req, res, next) {
  try {
    const result = await service.rejectReview(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Maqaan daldalaa dide.', data: result });
  } catch (err) { next(err); }
}

async function requestCorrection(req, res, next) {
  try {
    // Accept either correctionNotes or reviewComment from the body
    const body = {
      reviewComment: req.body.correctionNotes || req.body.reviewComment || req.body.reason || '',
    };
    const result = await service.requestCorrection(req.params.id, req.user.id, body, getIpAddress(req));
    return res.json({ success: true, message: 'Sirreessaan gaafatame.', data: result });
  } catch (err) { next(err); }
}

module.exports = { getStats, getQueue, getReviewDetail, approveReview, rejectReview, requestCorrection };
