// apps/backend/src/config/database.js
// Singleton Prisma client — import this everywhere in the backend.

const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const prisma = new PrismaClient({
  log: env.isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
