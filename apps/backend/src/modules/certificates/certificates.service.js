// apps/backend/src/modules/certificates/certificates.service.js

const QRCode = require('qrcode');
const prisma = require('../../config/database');
const { ROLES } = require('../../../../shared/constants/roles');

const CERT_INCLUDE = {
  application: {
    include: {
      applicant: { select: { id: true, fullName: true } },
      businessCategory: { select: { id: true, name: true } },
    },
  },
  issuedBy: { select: { id: true, fullName: true } },
};

async function getCertificate(certId, user) {
  const cert = await prisma.certificate.findUnique({
    where: { id: parseInt(certId, 10) },
    include: CERT_INCLUDE,
  });

  if (!cert) {
    const err = new Error('Waraqaan ragaa hin argamne.');
    err.status = 404;
    throw err;
  }

  // Ownership check
  if (user.role === ROLES.BUSINESS_OWNER && cert.application.applicantId !== user.id) {
    const err = new Error('Waraqaa ragaa kana ilaaluuf hayyama hin qabdu.');
    err.status = 403;
    throw err;
  }

  return cert;
}

async function listCertificates(user) {
  const where = {};
  if (user.role === ROLES.BUSINESS_OWNER) {
    where.application = { applicantId: user.id };
  }

  return prisma.certificate.findMany({
    where,
    include: CERT_INCLUDE,
    orderBy: { issuedAt: 'desc' },
  });
}

/** Generate QR code as data URL */
async function getQrCode(certId, user) {
  const cert = await getCertificate(certId, user);
  const qrDataUrl = await QRCode.toDataURL(cert.qrPayloadUrl);
  return { qrDataUrl, approvalNumber: cert.approvalNumber };
}

/**
 * Generate a simple text-based certificate.
 * In production, replace with PDF generation (pdfkit, puppeteer, etc.)
 */
function generateCertificateText(cert) {
  return `
══════════════════════════════════════════
   MAGAALAA ADAAMAA - WAAJJIRA DALDALAAA
   WARAQAA RAGAA MAQAA DALDALAA
══════════════════════════════════════════

Lakkoofsa Raggaasisaa: ${cert.approvalNumber}
Maqaa Daldalaa:        ${cert.application.proposedBusinessName}
Gosa Daldalaa:         ${cert.application.businessCategory.name}
Abbaa Daldalaa:        ${cert.application.applicant.fullName}
Guyyaa Ragaa:          ${new Date(cert.issuedAt).toLocaleDateString('om-ET')}
Ogeessa Mirkaneesse:   ${cert.issuedBy.fullName}

Mirkaneessuu dhaaf:
${cert.qrPayloadUrl}

═══════════════════════════════════════════
Waraqaan kun sirnaan kan qophaaye fi mirkanaa'e.
`.trim();
}

module.exports = { getCertificate, listCertificates, getQrCode, generateCertificateText };
