// User roles as defined in the AOBNAP system
export const ROLES = {
  BUSINESS_OWNER:    'BUSINESS_OWNER',
  FINANCIAL_OFFICER: 'FINANCIAL_OFFICER',
  LANGUAGE_OFFICER:  'LANGUAGE_OFFICER',
  SENIOR_OFFICER:    'SENIOR_OFFICER',
  ADMIN:             'ADMIN',
};

// Human-readable role labels
export const ROLE_LABELS = {
  [ROLES.BUSINESS_OWNER]:    'Business Owner',
  [ROLES.FINANCIAL_OFFICER]: 'Communication Biro',
  [ROLES.LANGUAGE_OFFICER]:  'Addaf Turizm Biro',
  [ROLES.SENIOR_OFFICER]:    'Commercial Office',
  [ROLES.ADMIN]:             'Administrator (IT Biro)',
};

// Role-based default redirect paths after login
export const ROLE_HOME_PATHS = {
  [ROLES.BUSINESS_OWNER]:    '/owner/dashboard',
  [ROLES.FINANCIAL_OFFICER]: '/communication/dashboard',
  [ROLES.LANGUAGE_OFFICER]:  '/turizm/dashboard',
  [ROLES.SENIOR_OFFICER]:    '/commercial/dashboard',
  [ROLES.ADMIN]:             '/admin/dashboard',
};
