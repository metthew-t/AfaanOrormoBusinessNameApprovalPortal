// Centralized route path constants
export const ROUTES = {
  // Public
  LOGIN:               '/login',
  SIGNUP:              '/signup',
  PUBLIC_NAMES:        '/public/business-names',
  PUBLIC_VERIFY:       '/public/verify',

  // Business Owner
  OWNER_DASHBOARD:     '/owner/dashboard',
  OWNER_APPLICATIONS:  '/owner/applications',
  OWNER_APP_NEW:       '/owner/applications/new',
  OWNER_APP_DETAIL:    '/owner/applications/:id',
  OWNER_CORRECTIONS:   '/owner/corrections',
  OWNER_APPEALS:       '/owner/appeals',
  OWNER_CERTIFICATES:  '/owner/certificates',
  OWNER_NOTIFICATIONS: '/owner/notifications',
  OWNER_PROFILE:       '/owner/profile',

  // Financial Officer
  FINANCIAL_DASHBOARD:     '/financial/dashboard',
  FINANCIAL_PERMISSIONS:   '/financial/permissions',
  FINANCIAL_PERM_DETAIL:   '/financial/permissions/:id',
  FINANCIAL_NOTIFICATIONS: '/financial/notifications',
  FINANCIAL_PROFILE:       '/financial/profile',

  // Language Officer
  LANGUAGE_DASHBOARD:     '/language/dashboard',
  LANGUAGE_REVIEWS:       '/language/reviews',
  LANGUAGE_REVIEW_DETAIL: '/language/reviews/:id',
  LANGUAGE_NOTIFICATIONS: '/language/notifications',
  LANGUAGE_PROFILE:       '/language/profile',

  // Senior Officer
  SENIOR_DASHBOARD:     '/senior/dashboard',
  SENIOR_APPEALS:       '/senior/appeals',
  SENIOR_APPEAL_DETAIL: '/senior/appeals/:id',
  SENIOR_NOTIFICATIONS: '/senior/notifications',
  SENIOR_PROFILE:       '/senior/profile',

  // Admin
  ADMIN_DASHBOARD:      '/admin/dashboard',
  ADMIN_USERS:          '/admin/users',
  ADMIN_CATEGORIES:     '/admin/categories',
  ADMIN_RESERVED_TERMS: '/admin/reserved-terms',
  ADMIN_HISTORICAL:     '/admin/historical-names',
  ADMIN_AUDIT_LOGS:     '/admin/audit-logs',
  ADMIN_PROFILE:        '/admin/profile',

  // Error
  FORBIDDEN: '/403',
  NOT_FOUND:  '/404',
};

// Helper: build a real path replacing :id
export const buildPath = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
