// apps/backend/src/modules/businessApplications/businessApplications.controller.js

const service = require('./businessApplications.service');
const { getIpAddress } = require('../auditLogs/auditLog.service');
const prisma = require('../../config/database');
const path = require('path');
const { DOCUMENT_TYPE } = require('../../../../../shared/constants/statuses');

async function createApplication(req, res, next) {
  try {
    const { proposedBusinessName, businessCategoryId, businessDescription, businessAddress } = req.body;
    const application = await service.createApplication(
      { applicantId: req.user.id, proposedBusinessName, businessCategoryId, businessDescription, businessAddress },
      getIpAddress(req)
    );
    return res.status(201).json({ success: true, message: 'Iyyatni uumame.', data: application });
  } catch (err) {
    next(err);
  }
}

async function listApplications(req, res, next) {
  try {
    const { page, limit, status } = req.query;
    const result = await service.listApplications(req.user, { page, limit, status });
    return res.json({ success: true, message: 'Iyyatawwan argaman.', data: result });
  } catch (err) {
    next(err);
  }
}

async function getApplication(req, res, next) {
  try {
    const application = await service.getApplication(req.params.id, req.user);
    return res.json({ success: true, message: 'Iyyatni argame.', data: application });
  } catch (err) {
    next(err);
  }
}

async function updateApplication(req, res, next) {
  try {
    const updated = await service.updateApplication(req.params.id, req.user.id, req.body, getIpAddress(req));
    return res.json({ success: true, message: 'Iyyatni haaromfame.', data: updated });
  } catch (err) {
    next(err);
  }
}

async function submitApplication(req, res, next) {
  try {
    const result = await service.submitApplication(parseInt(req.params.id, 10), req.user.id, getIpAddress(req));
    return res.json({ success: true, message: 'Iyyatni ergame.', data: result });
  } catch (err) {
    next(err);
  }
}

async function submitCorrection(req, res, next) {
  try {
    const updated = await service.submitCorrection(
      parseInt(req.params.id, 10),
      req.user.id,
      req.body,
      getIpAddress(req)
    );
    return res.json({ success: true, message: 'Sirreessaan ergame.', data: updated });
  } catch (err) {
    next(err);
  }
}

async function getTimeline(req, res, next) {
  try {
    const result = await service.getTimeline(req.params.id, req.user);
    return res.json({ success: true, message: 'Seenaa argame.', data: result });
  } catch (err) {
    next(err);
  }
}

/** POST /api/applications/:id/documents — upload permission document */
async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Faayilii ergi.', errors: [] });
    }

    const applicationId = parseInt(req.params.id, 10);
    const application = await service.getApplication(applicationId, req.user);

    const doc = await prisma.uploadedDocument.create({
      data: {
        applicationId,
        documentType: req.body.documentType || DOCUMENT_TYPE.BUSINESS_PERMISSION,
        originalFilename: req.file.originalname,
        storedFilename: req.file.filename,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        storagePath: req.file.path,
        uploadedById: req.user.id,
      },
    });

    return res.status(201).json({ success: true, message: 'Faayiliin fe\'ame.', data: doc });
  } catch (err) {
    next(err);
  }
}

/** GET /api/applications/:id/documents/:docId — download (authenticated, ownership checked) */
async function downloadDocument(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const docId = parseInt(req.params.docId, 10);

    // Ownership check via application
    await service.getApplication(applicationId, req.user);

    const doc = await prisma.uploadedDocument.findFirst({
      where: { id: docId, applicationId },
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Faayiliin hin argamne.', errors: [] });
    }

    return res.download(doc.storagePath, doc.originalFilename);
  } catch (err) {
    next(err);
  }
}

async function listCorrections(req, res, next) {
  try {
    const data = await service.listCorrections(req.user.id);
    return res.json({ success: true, message: 'Sirreessawwan argaman.', data });
  } catch (err) { next(err); }
}

module.exports = {
  createApplication,
  listApplications,
  getApplication,
  updateApplication,
  submitApplication,
  submitCorrection,
  getTimeline,
  uploadDocument,
  downloadDocument,
  listCorrections,
};
