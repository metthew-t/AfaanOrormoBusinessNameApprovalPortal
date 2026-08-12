// apps/backend/src/modules/languageReviews/languageReviews.controller.js

const service = require('./languageReviews.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');

async function listLanguageReviews(req, res, next) {
  try {
    const result = await service.listLanguageReviews(req.query);
    return res.json({ success: true, message: 'Madaallii afaanii argaman.', data: result });
  } catch (err) { next(err); }
}

async function getLanguageReview(req, res, next) {
  try {
    const review = await service.getLanguageReview(req.params.id);
    return res.json({ success: true, message: 'Madaalliin afaanii argame.', data: review });
  } catch (err) { next(err); }
}

async function approveLanguageReview(req, res, next) {
  try {
    const result = await service.approveLanguageReview(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Maqaan daldalaa mirkana\'e.', data: result });
  } catch (err) { next(err); }
}

async function rejectLanguageReview(req, res, next) {
  try {
    const result = await service.rejectLanguageReview(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Maqaan daldalaa dide.', data: result });
  } catch (err) { next(err); }
}

async function requestLRCorrection(req, res, next) {
  try {
    const result = await service.requestLRCorrection(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Sirreessaan gaafatame.', data: result });
  } catch (err) { next(err); }
}

module.exports = { listLanguageReviews, getLanguageReview, approveLanguageReview, rejectLanguageReview, requestLRCorrection };
