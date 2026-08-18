// apps/backend/src/modules/publicVerification/publicVerification.controller.js
// No auth required — returns only whitelisted public fields (no PII, no internal data)

const prisma = require('../../config/database');
const { normalizeBusinessName } = require('../../../../../shared/utils/normalizeBusinessName');

/** GET /api/public/business-names/search?q=... */
async function searchBusinessNames(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Barbaaduu gara galchi (hir\'ata qubee 2).',
        errors: [],
      });
    }

    const normalized = normalizeBusinessName(q);

    const results = await prisma.businessNameRegistry.findMany({
      where: {
        isActive: true,
        normalizedBusinessName: { contains: normalized },
      },
      select: {
        businessName: true,
        normalizedBusinessName: true,
        source: true,
        createdAt: true,
        application: {
          select: {
            applicationNumber: true,
            businessCategory: { select: { name: true } },
            certificate: { select: { approvalNumber: true, issuedAt: true } },
          },
        },
      },
      take: 20,
      orderBy: { businessName: 'asc' },
    });

    return res.json({
      success: true,
      message: 'Filannoowwan argaman.',
      data: { results, count: results.length },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/public/certificates/verify/:approvalNumber */
async function verifyCertificate(req, res, next) {
  try {
    const { approvalNumber } = req.params;

    const cert = await prisma.certificate.findUnique({
      where: { approvalNumber },
      include: {
        application: {
          include: {
            businessCategory: { select: { name: true } },
          },
        },
        issuedBy: { select: { fullName: true } },
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Waraqaan ragaa kun hin argamne ykn sirrii miti.',
        data: { valid: false },
      });
    }

    // Return only whitelisted public fields — never PII
    return res.json({
      success: true,
      message: 'Waraqaan ragaa mirkanaa\'e.',
      data: {
        valid: cert.isValid,
        approvalNumber: cert.approvalNumber,
        businessName: cert.application.proposedBusinessName,
        businessCategory: cert.application.businessCategory.name,
        approvalDate: cert.issuedAt,
        issuingOffice: 'Waajjira Daldalaa Magaalaa Adaamaa',
        issuedByName: cert.issuedBy.fullName,
        currentStatus: cert.isValid ? 'VALID' : 'INVALID',
      },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/public/verify-certificate?approvalNumber=... */
async function verifyCertificateByQuery(req, res, next) {
  const { approvalNumber } = req.query;
  if (!approvalNumber) {
    return res.status(400).json({ success: false, message: 'Lakkoofsa ragaa galchi.', errors: [] });
  }
  req.params = { approvalNumber };
  return verifyCertificate(req, res, next);
}

module.exports = { searchBusinessNames, verifyCertificate, verifyCertificateByQuery };
