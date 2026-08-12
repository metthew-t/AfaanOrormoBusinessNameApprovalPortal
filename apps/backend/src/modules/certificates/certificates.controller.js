// apps/backend/src/modules/certificates/certificates.controller.js

const service = require('./certificates.service');

async function listCertificates(req, res, next) {
  try {
    const certs = await service.listCertificates(req.user);
    return res.json({ success: true, message: 'Waraqaawwan ragaa argaman.', data: certs });
  } catch (err) { next(err); }
}

async function getCertificate(req, res, next) {
  try {
    const cert = await service.getCertificate(req.params.id, req.user);
    return res.json({ success: true, message: 'Waraqaan ragaa argame.', data: cert });
  } catch (err) { next(err); }
}

async function downloadCertificate(req, res, next) {
  try {
    const cert = await service.getCertificate(req.params.id, req.user);
    const text = service.generateCertificateText(cert);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${cert.approvalNumber}.txt"`);
    return res.send(text);
  } catch (err) { next(err); }
}

async function getQrCode(req, res, next) {
  try {
    const result = await service.getQrCode(req.params.id, req.user);
    return res.json({ success: true, message: 'QR argame.', data: result });
  } catch (err) { next(err); }
}

module.exports = { listCertificates, getCertificate, downloadCertificate, getQrCode };
