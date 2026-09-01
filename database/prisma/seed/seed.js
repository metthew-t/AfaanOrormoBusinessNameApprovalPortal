// database/prisma/seed/seed.js
// Seeds: roles, admin user, sample business categories, reserved terms

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ROLES = [
  'BUSINESS_OWNER',
  'FINANCIAL_OFFICER',
  'LANGUAGE_OFFICER',
  'SENIOR_OFFICER',
  'ADMIN',
];

const CATEGORIES = [
  'Daldalaa Nyaataa fi Dhugaatii',
  'Hojii Ijaarsa',
  'Tajaajila Fayyaa',
  'Barnootaa fi Leenjii',
  'Geejjiba fi Konkolaataa',
  'Teekinooloojii odeeffannoo',
  'Hojii Qonnaa',
  'Daldalaa Uffataa',
  'Tajaajila Faayinaansii',
  'Hojii Aartii fi Aadaa',
];

const RESERVED_TERMS = [
  'mootummaa',
  'daldala',
  'waajjira',
  'poolisii',
  'oromiyaa',
  'adama',
  'bank',
  'hospitaala',
  'yuunivarsiitii',
  'mana barumsaa',
];

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Roles
  console.log('  → Creating roles...');
  for (const roleName of ROLES) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
  console.log(`  ✓ ${ROLES.length} roles created`);

  // 2. Seed Admin User
  console.log('  → Creating admin user...');
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aobnap.gov.et' },
    update: {},
    create: {
      fullName: 'Administrator',
      email: 'admin@aobnap.gov.et',
      phoneNumber: '+251911000001',
      passwordHash: adminPasswordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  });
  console.log(`  ✓ Admin user created: ${admin.email}`);

  // 3. Seed officer users
  console.log('  → Creating officer users...');
  const officerRoles = [
    { role: 'FINANCIAL_OFFICER', name: 'Ogeessa Faayinaansii', email: 'financial@aobnap.gov.et', phone: '+251911000002' },
    { role: 'LANGUAGE_OFFICER', name: 'Ogeessa Afaan Oromoo', email: 'language@aobnap.gov.et', phone: '+251911000003' },
    { role: 'SENIOR_OFFICER', name: 'Ogeessa Olaanaa', email: 'senior@aobnap.gov.et', phone: '+251911000004' },
  ];

  for (const officer of officerRoles) {
    const role = await prisma.role.findUnique({ where: { name: officer.role } });
    const hash = await bcrypt.hash('Officer@123456', 12);
    await prisma.user.upsert({
      where: { email: officer.email },
      update: {},
      create: {
        fullName: officer.name,
        email: officer.email,
        phoneNumber: officer.phone,
        passwordHash: hash,
        roleId: role.id,
        isActive: true,
      },
    });
  }
  console.log(`  ✓ ${officerRoles.length} officer users created`);

  // 4. Seed Business Categories
  console.log('  → Creating business categories...');
  for (const name of CATEGORIES) {
    await prisma.businessCategory.upsert({
      where: { id: CATEGORIES.indexOf(name) + 1 },
      update: {},
      create: { name, isActive: true },
    });
  }
  console.log(`  ✓ ${CATEGORIES.length} categories created`);

  // 5. Seed Reserved Terms
  console.log('  → Creating reserved terms...');
  const { normalizeBusinessName } = require('../../../shared/utils/normalizeBusinessName');

  for (const term of RESERVED_TERMS) {
    const normalizedTerm = normalizeBusinessName(term);
    await prisma.reservedTerm.upsert({
      where: { normalizedTerm },
      update: {},
      create: {
        term,
        normalizedTerm,
        createdById: admin.id,
      },
    });
  }
  console.log(`  ✓ ${RESERVED_TERMS.length} reserved terms created`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\nDefault credentials:');
  console.log('  Admin:            admin@aobnap.gov.et / Admin@123456');
  console.log('  Financial Officer: financial@aobnap.gov.et / Officer@123456');
  console.log('  Language Officer:  language@aobnap.gov.et / Officer@123456');
  console.log('  Senior Officer:    senior@aobnap.gov.et / Officer@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
