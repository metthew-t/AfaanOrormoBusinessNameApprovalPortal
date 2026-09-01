// Application status codes — must match backend state machine exactly
export const APPLICATION_STATUS = {
  DRAFT:                          'DRAFT',
  SUBMITTED:                      'SUBMITTED',
  PERMISSION_PENDING:             'PERMISSION_PENDING',
  PERMISSION_CORRECTION_REQUIRED: 'PERMISSION_CORRECTION_REQUIRED',
  PERMISSION_REJECTED:            'PERMISSION_REJECTED',
  PERMISSION_APPROVED:            'PERMISSION_APPROVED',
  LANGUAGE_REVIEW_PENDING:        'LANGUAGE_REVIEW_PENDING',
  LANGUAGE_CORRECTION_REQUIRED:   'LANGUAGE_CORRECTION_REQUIRED',
  LANGUAGE_REJECTED:              'LANGUAGE_REJECTED',
  APPROVED:                       'APPROVED',
  APPEAL_SUBMITTED:               'APPEAL_SUBMITTED',
  APPEAL_UNDER_REVIEW:            'APPEAL_UNDER_REVIEW',
  APPEAL_APPROVED:                'APPEAL_APPROVED',
  APPEAL_REJECTED:                'APPEAL_REJECTED',
};

// Human-readable labels for statuses
export const STATUS_LABELS = {
  [APPLICATION_STATUS.DRAFT]:                          'Draft',
  [APPLICATION_STATUS.SUBMITTED]:                      'Submitted',
  [APPLICATION_STATUS.PERMISSION_PENDING]:             'Permission Pending',
  [APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED]: 'Correction Required',
  [APPLICATION_STATUS.PERMISSION_REJECTED]:            'Permission Rejected',
  [APPLICATION_STATUS.PERMISSION_APPROVED]:            'Permission Approved',
  [APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING]:        'Language Review Pending',
  [APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED]:   'Correction Required',
  [APPLICATION_STATUS.LANGUAGE_REJECTED]:              'Language Rejected',
  [APPLICATION_STATUS.APPROVED]:                       'Approved',
  [APPLICATION_STATUS.APPEAL_SUBMITTED]:               'Appeal Submitted',
  [APPLICATION_STATUS.APPEAL_UNDER_REVIEW]:            'Appeal Under Review',
  [APPLICATION_STATUS.APPEAL_APPROVED]:                'Appeal Approved',
  [APPLICATION_STATUS.APPEAL_REJECTED]:                'Appeal Rejected',
};

// Badge variant for each status
export const STATUS_BADGE_VARIANT = {
  [APPLICATION_STATUS.DRAFT]:                          'neutral',
  [APPLICATION_STATUS.SUBMITTED]:                      'info',
  [APPLICATION_STATUS.PERMISSION_PENDING]:             'warning',
  [APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED]: 'orange',
  [APPLICATION_STATUS.PERMISSION_REJECTED]:            'danger',
  [APPLICATION_STATUS.PERMISSION_APPROVED]:            'success',
  [APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING]:        'warning',
  [APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED]:   'orange',
  [APPLICATION_STATUS.LANGUAGE_REJECTED]:              'danger',
  [APPLICATION_STATUS.APPROVED]:                       'success',
  [APPLICATION_STATUS.APPEAL_SUBMITTED]:               'info',
  [APPLICATION_STATUS.APPEAL_UNDER_REVIEW]:            'warning',
  [APPLICATION_STATUS.APPEAL_APPROVED]:                'success',
  [APPLICATION_STATUS.APPEAL_REJECTED]:                'danger',
};

// Appeal status codes
export const APPEAL_STATUS = {
  SUBMITTED:    'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED:     'APPROVED',
  REJECTED:     'REJECTED',
};

export const APPEAL_STATUS_LABELS = {
  [APPEAL_STATUS.SUBMITTED]:    'Submitted',
  [APPEAL_STATUS.UNDER_REVIEW]: 'Under Review',
  [APPEAL_STATUS.APPROVED]:     'Approved',
  [APPEAL_STATUS.REJECTED]:     'Rejected',
};

export const APPEAL_STATUS_BADGE = {
  [APPEAL_STATUS.SUBMITTED]:    'info',
  [APPEAL_STATUS.UNDER_REVIEW]: 'warning',
  [APPEAL_STATUS.APPROVED]:     'success',
  [APPEAL_STATUS.REJECTED]:     'danger',
};

// User account statuses
export const USER_STATUS = {
  ACTIVE:   'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED:'SUSPENDED',
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]:    'Active',
  [USER_STATUS.INACTIVE]:  'Inactive',
  [USER_STATUS.SUSPENDED]: 'Suspended',
};

export const USER_STATUS_BADGE = {
  [USER_STATUS.ACTIVE]:    'success',
  [USER_STATUS.INACTIVE]:  'neutral',
  [USER_STATUS.SUSPENDED]: 'danger',
};

// Certificate status
export const CERTIFICATE_STATUS = {
  ISSUED:  'ISSUED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
};

export const CERTIFICATE_STATUS_LABELS = {
  [CERTIFICATE_STATUS.ISSUED]:  'Issued',
  [CERTIFICATE_STATUS.REVOKED]: 'Revoked',
  [CERTIFICATE_STATUS.EXPIRED]: 'Expired',
};

export const CERTIFICATE_STATUS_BADGE = {
  [CERTIFICATE_STATUS.ISSUED]:  'success',
  [CERTIFICATE_STATUS.REVOKED]: 'danger',
  [CERTIFICATE_STATUS.EXPIRED]: 'neutral',
};
