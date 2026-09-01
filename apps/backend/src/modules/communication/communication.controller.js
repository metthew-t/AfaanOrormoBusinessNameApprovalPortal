const service = require('./communication.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');

async function getStats(req, res, next) {
  try {
    const stats = await service.getStats();
    return res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

async function getApplications(req, res, next) {
  try {
    const applications = await service.getIncomingApplications();
    return res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

async function getApplicationDetail(req, res, next) {
  try {
    const application = await service.getApplicationDetail(parseInt(req.params.id, 10));
    return res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
}

async function routeApplication(req, res, next) {
  try {
    const { routeToCommercial, routeToTurizm } = req.body;
    await service.routeApplication(parseInt(req.params.id, 10), { routeToCommercial, routeToTurizm }, req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Application routed successfully' });
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await service.getMessages(req.user.id);
    return res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const message = await service.sendMessage(req.user, req.body);
    return res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

async function markMessageRead(req, res, next) {
  try {
    await service.markMessageRead(parseInt(req.params.id, 10), req.user.id);
    return res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    next(err);
  }
}

async function getFromCommercial(req, res, next) {
  try {
    const applications = await service.getApplicationsFromDepartment('commercial');
    return res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

async function getFromTurizm(req, res, next) {
  try {
    const applications = await service.getApplicationsFromDepartment('turizm');
    return res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    await service.updateApplicationStatus(parseInt(req.params.id, 10), req.body, req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Status updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function acceptApplication(req, res, next) {
  try {
    await service.acceptApplication(req.body, req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Application accepted' });
  } catch (err) {
    next(err);
  }
}

async function rejectApplication(req, res, next) {
  try {
    await service.rejectApplication(req.body, req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Application rejected' });
  } catch (err) {
    next(err);
  }
}

async function sendFinalDecision(req, res, next) {
  try {
    await service.sendFinalDecision(req.body, req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Final decision sent' });
  } catch (err) {
    next(err);
  }
}

async function getReviewedApplications(req, res, next) {
  try {
    const applications = await service.getReviewedApplications();
    return res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
}

async function makeFinalDecision(req, res, next) {
  try {
    const { decision, reason } = req.body;
    const result = await service.makeFinalDecision(
      parseInt(req.params.id, 10),
      { decision, reason },
      req.user.id,
      getIpAddress(req)
    );
    return res.json({ success: true, message: 'Final decision made successfully', data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  getApplications,
  getApplicationDetail,
  routeApplication,
  getMessages,
  sendMessage,
  markMessageRead,
  getFromCommercial,
  getFromTurizm,
  updateApplicationStatus,
  acceptApplication,
  rejectApplication,
  sendFinalDecision,
  getReviewedApplications,
  makeFinalDecision,
};
