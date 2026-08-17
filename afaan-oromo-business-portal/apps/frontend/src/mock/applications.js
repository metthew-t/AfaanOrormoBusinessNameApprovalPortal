// Mock application data for frontend development

export const MOCK_CATEGORIES = [
  { id: 'cat-01', name: 'Daldala Bitaa fi Gurgurtaa', nameEn: 'Retail Trade', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-02', name: 'Tajaajila Teknolojii', nameEn: 'Information Technology', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-03', name: 'Qonnaa fi Horsiisee Bulaa', nameEn: 'Agriculture', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-04', name: 'Ijaarsa fi Dizaayinii', nameEn: 'Construction & Design', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-05', name: 'Fayyaa fi Hospitaalaa', nameEn: 'Health & Medical', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-06', name: 'Barnootaa fi Leenjii', nameEn: 'Education & Training', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-07', name: 'Geejibaa fi Tiraanspoortii', nameEn: 'Transport & Logistics', status: 'INACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-08', name: 'Kan Biraa (Other)', nameEn: 'Other', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
];

export const MOCK_RESERVED_TERMS = [
  { id: 'trm-01', term: 'Mootummaa', createdBy: 'Firaol Guutuu', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'trm-02', term: 'Biyyoolessa', createdBy: 'Firaol Guutuu', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'trm-03', term: 'Oromiyaa', createdBy: 'Firaol Guutuu', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'trm-04', term: 'Poolisii', createdBy: 'Firaol Guutuu', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'trm-05', term: 'Banka', createdBy: 'Firaol Guutuu', createdAt: '2026-03-10T00:00:00.000Z' },
];

export const MOCK_HISTORICAL_NAMES = [
  { id: 'hist-01', businessName: 'Baqqalaa Daldala', source: 'Historical Registry', status: 'ACTIVE', date: '2020-05-01T00:00:00.000Z' },
  { id: 'hist-02', businessName: 'Gammachuu Qonnaa', source: 'Historical Registry', status: 'ACTIVE', date: '2019-11-12T00:00:00.000Z' },
  { id: 'hist-03', businessName: 'Ifaa Tajaajila', source: 'Legacy Import', status: 'ACTIVE', date: '2021-03-22T00:00:00.000Z' },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'log-01', actor: 'Firaol Guutuu', action: 'CREATE_USER', entity: 'User', entityId: 'usr-006', date: '2026-08-10T09:15:00.000Z', details: 'Created new Business Owner account' },
  { id: 'log-02', actor: 'Caaltuu Gamtaa', action: 'APPROVE_PERMISSION', entity: 'Application', entityId: 'APP-001', date: '2026-08-10T10:30:00.000Z', details: 'Approved business permission document' },
  { id: 'log-03', actor: 'Dargaggoo Tasammaa', action: 'REJECT_LANGUAGE', entity: 'Application', entityId: 'APP-002', date: '2026-08-10T11:00:00.000Z', details: 'Rejected due to invalid Afaan Oromo spelling' },
  { id: 'log-04', actor: 'Elemaa Diimaa', action: 'APPROVE_APPEAL', entity: 'Appeal', entityId: 'APL-001', date: '2026-08-09T14:00:00.000Z', details: 'Appeal approved after review' },
  { id: 'log-05', actor: 'Firaol Guutuu', action: 'ADD_RESERVED_TERM', entity: 'ReservedTerm', entityId: 'trm-05', date: '2026-08-08T08:45:00.000Z', details: 'Added reserved term: Banka' },
];

export const MOCK_APPLICATIONS = [
  {
    id: 'APP-001',
    applicationNumber: 'AOB-2026-0001',
    businessName: 'Baqqalaa Nagaa Daldala PLC',
    category: { id: 'cat-01', name: 'Daldala Bitaa fi Gurgurtaa' },
    description: 'Daldala meeshaalee mana nyaataa fi dhugaatii adda addaa.',
    address: 'Finfinnee, Oromiyaa, Booraa 03',
    status: 'APPROVED',
    submittedAt: '2026-01-15T09:30:00.000Z',
    createdAt: '2026-01-14T08:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: { name: 'permission.pdf', url: '/mock/docs/permission.pdf', size: 204800 },
    financialReview: { status: 'APPROVED', reviewedBy: 'Caaltuu Gamtaa', reviewedAt: '2026-01-16T10:00:00.000Z', comment: null },
    languageReview: { status: 'APPROVED', reviewedBy: 'Dargaggoo Tasammaa', reviewedAt: '2026-01-18T11:00:00.000Z', comment: null, spelling: true, grammar: true, meaning: true },
    certificate: { id: 'CERT-001', approvalNumber: 'AOB-2026-0001', issuedAt: '2026-01-20T00:00:00.000Z' },
  },
  {
    id: 'APP-002',
    applicationNumber: 'AOB-2026-0002',
    businessName: 'Ifaa Teknolojii Dhaabbata',
    category: { id: 'cat-02', name: 'Tajaajila Teknolojii' },
    description: 'Tajaajila software fi moobaayilii dhaabbata xixiqqaaf.',
    address: 'Adaamaa, Oromiyaa',
    status: 'LANGUAGE_REVIEW_PENDING',
    submittedAt: '2026-02-10T09:00:00.000Z',
    createdAt: '2026-02-09T07:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: { name: 'permission2.pdf', url: '/mock/docs/permission2.pdf', size: 350000 },
    financialReview: { status: 'APPROVED', reviewedBy: 'Caaltuu Gamtaa', reviewedAt: '2026-02-12T09:00:00.000Z', comment: null },
    languageReview: null,
    certificate: null,
  },
  {
    id: 'APP-003',
    applicationNumber: 'AOB-2026-0003',
    businessName: 'Horsiisee Bulaa Qonnaa',
    category: { id: 'cat-03', name: 'Qonnaa fi Horsiisee Bulaa' },
    description: 'Horticulture fi qonnaa xixiqqaa naannoo Finfinnee.',
    address: 'Sandaafaa, Oromiyaa',
    status: 'PERMISSION_CORRECTION_REQUIRED',
    submittedAt: '2026-03-05T10:00:00.000Z',
    createdAt: '2026-03-04T09:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: { name: 'permission3.pdf', url: '/mock/docs/permission3.pdf', size: 128000 },
    financialReview: { status: 'CORRECTION_REQUIRED', reviewedBy: 'Caaltuu Gamtaa', reviewedAt: '2026-03-07T10:00:00.000Z', comment: 'Beenyaa heeyyamaa guuttaa ta\'uu qabu. Maaloo galmee fooyyessitee ergi.' },
    languageReview: null,
    certificate: null,
  },
  {
    id: 'APP-004',
    applicationNumber: 'AOB-2026-0004',
    businessName: 'Karoora Dhaabbata Ijaarsa',
    category: { id: 'cat-04', name: 'Ijaarsa fi Dizaayinii' },
    description: 'Tajaajila ijaarsa mana jireenyaa fi dhaabbata.',
    address: 'Jimmaa, Oromiyaa',
    status: 'DRAFT',
    submittedAt: null,
    createdAt: '2026-08-01T07:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: null,
    financialReview: null,
    languageReview: null,
    certificate: null,
  },
  {
    id: 'APP-005',
    applicationNumber: 'AOB-2026-0005',
    businessName: 'Fayyaa Tajaajila Hospitaalaa',
    category: { id: 'cat-05', name: 'Fayyaa fi Hospitaalaa' },
    description: 'Kilinika fayyaa daa\'ima fi haadha.',
    address: 'Naqamtee, Oromiyaa',
    status: 'LANGUAGE_REJECTED',
    submittedAt: '2026-04-10T09:00:00.000Z',
    createdAt: '2026-04-09T08:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: { name: 'permission5.pdf', url: '/mock/docs/permission5.pdf', size: 256000 },
    financialReview: { status: 'APPROVED', reviewedBy: 'Caaltuu Gamtaa', reviewedAt: '2026-04-12T09:00:00.000Z', comment: null },
    languageReview: { status: 'REJECTED', reviewedBy: 'Dargaggoo Tasammaa', reviewedAt: '2026-04-15T10:00:00.000Z', comment: 'Maqaan daldalaa afaan Oromoo sirrii miti. "Hospitaalaa" jedhu dhaabbataalee fayyaa qofaaf tajaajila.', spelling: false, grammar: false, meaning: true },
    certificate: null,
  },
];

// Corrections needing action from the owner
export const MOCK_CORRECTIONS = [
  {
    id: 'COR-001',
    applicationId: 'APP-003',
    applicationNumber: 'AOB-2026-0003',
    businessName: 'Horsiisee Bulaa Qonnaa',
    type: 'FINANCIAL',
    reason: 'Beenyaa heeyyamaa guuttaa ta\'uu qabu. Maaloo galmee fooyyessitee ergi.',
    requestedAt: '2026-03-07T10:00:00.000Z',
    requestedBy: 'Caaltuu Gamtaa',
    status: 'PENDING',
  },
];

// Financial officer permission queue
export const MOCK_PERMISSION_QUEUE = [
  {
    id: 'APP-006',
    applicationNumber: 'AOB-2026-0006',
    businessName: 'Giddu Galeessa Barnootaa',
    category: { id: 'cat-06', name: 'Barnootaa fi Leenjii' },
    description: 'Mana barumsaa kutaalee 1-8.',
    address: 'Shaashamannee, Oromiyaa',
    status: 'PERMISSION_PENDING',
    submittedAt: '2026-08-08T08:00:00.000Z',
    owner: { id: 'usr-006', fullName: 'Geetuu Tasfaayee', email: 'owner2@aobnap.gov.et', phone: '+251966789012' },
    permissionDocument: { name: 'permission6.pdf', url: '/mock/docs/permission6.pdf', size: 512000 },
  },
  {
    id: 'APP-007',
    applicationNumber: 'AOB-2026-0007',
    businessName: 'Biqiltuuu Café',
    category: { id: 'cat-01', name: 'Daldala Bitaa fi Gurgurtaa' },
    description: 'Caffee fi nyaata xixiqqaa.',
    address: 'Bishooftuu, Oromiyaa',
    status: 'PERMISSION_PENDING',
    submittedAt: '2026-08-09T09:00:00.000Z',
    owner: { id: 'usr-007', fullName: 'Hawi Tolaa', email: 'owner3@aobnap.gov.et', phone: '+251977890123' },
    permissionDocument: { name: 'permission7.pdf', url: '/mock/docs/permission7.pdf', size: 310000 },
  },
  ...MOCK_APPLICATIONS.filter((a) => a.status === 'PERMISSION_CORRECTION_REQUIRED').map((a) => ({
    ...a,
    status: 'PERMISSION_CORRECTION_REQUIRED',
  })),
];

// Language officer review queue
export const MOCK_LANGUAGE_QUEUE = [
  {
    id: 'APP-002',
    applicationNumber: 'AOB-2026-0002',
    businessName: 'Ifaa Teknolojii Dhaabbata',
    category: { id: 'cat-02', name: 'Tajaajila Teknolojii' },
    description: 'Tajaajila software fi moobaayilii dhaabbata xixiqqaaf.',
    address: 'Adaamaa, Oromiyaa',
    status: 'LANGUAGE_REVIEW_PENDING',
    submittedAt: '2026-02-10T09:00:00.000Z',
    owner: { id: 'usr-001', fullName: 'Alamuu Baqqalaa', email: 'owner@aobnap.gov.et', phone: '+251911234567' },
    permissionDocument: { name: 'permission2.pdf', url: '/mock/docs/permission2.pdf', size: 350000 },
    financialReview: { status: 'APPROVED', reviewedBy: 'Caaltuu Gamtaa', reviewedAt: '2026-02-12T09:00:00.000Z', comment: null },
    languageReview: null,
  },
  {
    id: 'APP-008',
    applicationNumber: 'AOB-2026-0008',
    businessName: 'Dhiigaa Qulqullina Dhaabbata',
    category: { id: 'cat-05', name: 'Fayyaa fi Hospitaalaa' },
    description: 'Dhiigaa kennuu fi fudhaatii tajaajila.',
    address: 'Amboo, Oromiyaa',
    status: 'LANGUAGE_REVIEW_PENDING',
    submittedAt: '2026-08-07T11:00:00.000Z',
    owner: { id: 'usr-006', fullName: 'Geetuu Tasfaayee', email: 'owner2@aobnap.gov.et', phone: '+251966789012' },
    permissionDocument: { name: 'permission8.pdf', url: '/mock/docs/permission8.pdf', size: 198000 },
    financialReview: { status: 'APPROVED', reviewedBy: 'Ittiqaa Dajanee', reviewedAt: '2026-08-09T09:00:00.000Z', comment: null },
    languageReview: null,
  },
];
