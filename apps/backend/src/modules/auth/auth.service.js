// apps/backend/src/modules/auth/auth.service.js
// Business logic for authentication

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const env = require('../../config/env');
const { ROLES } = require('../../../../shared/constants/roles');
const { writeAuditLog } = require('../auditLogs/auditLog.service');
const nationalIdService = require('./nationalIdService');

const BCRYPT_ROUNDS = 12;

/** Generates both access and refresh tokens */
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

/** Register a new BUSINESS_OWNER */
async function register({ fullName, email, phoneNumber, password, nationalIdRef }, ipAddress) {
  // Check duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Imeeliin kun duraan galmaa\'ee jira.');
    err.status = 409;
    throw err;
  }

  // Check duplicate phone
  if (phoneNumber) {
    const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      const err = new Error('Lakkoofsi bilbilaa kun duraan galmaa\'ee jira.');
      err.status = 409;
      throw err;
    }
  }

  const role = await prisma.role.findUnique({ where: { name: ROLES.BUSINESS_OWNER } });
  if (!role) throw new Error('Gahee BUSINESS_OWNER hin argamne. Kuusaa daataa mirkaneessi.');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phoneNumber: phoneNumber || null,
      nationalIdRef: nationalIdRef || null,
      passwordHash,
      roleId: role.id,
    },
    include: { role: true },
  });

  await writeAuditLog({
    actorUserId: user.id,
    action: 'USER_REGISTERED',
    entityType: 'User',
    entityId: user.id,
    newValue: { email, fullName },
    ipAddress,
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    },
  };
}

/** Login */
async function login({ email, password }, ipAddress) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    await writeAuditLog({
      actorUserId: null,
      action: 'LOGIN_FAILED',
      entityType: 'User',
      newValue: { email, reason: user ? 'inactive' : 'not_found' },
      ipAddress,
    });
    const err = new Error('Imeeli ykn jecha icciitii sirrii miti.');
    err.status = 401;
    throw err;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    await writeAuditLog({
      actorUserId: user.id,
      action: 'LOGIN_FAILED',
      entityType: 'User',
      entityId: user.id,
      newValue: { reason: 'wrong_password' },
      ipAddress,
    });
    const err = new Error('Imeeli ykn jecha icciitii sirrii miti.');
    err.status = 401;
    throw err;
  }

  await writeAuditLog({
    actorUserId: user.id,
    action: 'LOGIN_SUCCESS',
    entityType: 'User',
    entityId: user.id,
    ipAddress,
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    },
  };
}

/** Rotate refresh token */
async function refreshAccessToken(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    const err = new Error('Refresh token sirrii miti ykn yeroon isaa dabree jira.');
    err.status = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    const err = new Error('Fayyadamaan hin argamne ykn hojii irraa dhaabame.');
    err.status = 401;
    throw err;
  }

  const tokens = generateTokens(user.id);
  return {
    ...tokens,
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role.name },
  };
}

/** Verify National ID — records result in identity_verifications */
async function verifyNationalId({ nationalIdNumber, userId, applicationId }, ipAddress) {
  const result = await nationalIdService.verifyIdentity({ nationalIdNumber, userId, applicationId });

  await prisma.identityVerification.create({
    data: {
      userId,
      applicationId: applicationId || null,
      provider: env.NATIONAL_ID_PROVIDER || 'MOCK',
      status: result.status,
      verifiedAt: result.status === 'VERIFIED' ? new Date() : null,
      referenceId: result.referenceId || null,
    },
  });

  await writeAuditLog({
    actorUserId: userId,
    action: 'IDENTITY_VERIFICATION_ATTEMPTED',
    entityType: 'IdentityVerification',
    newValue: { status: result.status, applicationId },
    ipAddress,
  });

  return result;
}

/** Get current user profile */
async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      nationalIdRef: true,
      isActive: true,
      createdAt: true,
      role: { select: { name: true } },
    },
  });

  if (!user) {
    const err = new Error('Fayyadamaan hin argamne.');
    err.status = 404;
    throw err;
  }

  return { ...user, role: user.role.name };
}

module.exports = { register, login, refreshAccessToken, verifyNationalId, getMe };
