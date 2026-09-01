// apps/backend/src/modules/businessApplications/businessApplications.repository.js
// All direct Prisma queries for business applications.

const prisma = require('../../config/database');

const APPLICATION_INCLUDE = {
  applicant: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
  businessCategory: { select: { id: true, name: true } },
  permission: {
    include: {
      reviewer: { select: { id: true, fullName: true, email: true } }
    }
  },
  languageReview: {
    include: {
      reviewer: { select: { id: true, fullName: true, email: true } }
    }
  },
  documents: true,
  certificate: true,
};

async function findById(id) {
  return prisma.businessApplication.findUnique({
    where: { id },
    include: APPLICATION_INCLUDE,
  });
}

async function findByIdOwned(id, applicantId) {
  return prisma.businessApplication.findFirst({
    where: { id, applicantId },
    include: APPLICATION_INCLUDE,
  });
}

async function findAll({ where, skip, take }) {
  return prisma.businessApplication.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: APPLICATION_INCLUDE,
  });
}

async function count(where) {
  return prisma.businessApplication.count({ where });
}

async function create(data) {
  return prisma.businessApplication.create({ data, include: APPLICATION_INCLUDE });
}

async function updateStatus(id, status) {
  return prisma.businessApplication.update({
    where: { id },
    data: { status, updatedAt: new Date() },
    include: APPLICATION_INCLUDE,
  });
}

async function update(id, data) {
  return prisma.businessApplication.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
    include: APPLICATION_INCLUDE,
  });
}

module.exports = { findById, findByIdOwned, findAll, count, create, updateStatus, update };
