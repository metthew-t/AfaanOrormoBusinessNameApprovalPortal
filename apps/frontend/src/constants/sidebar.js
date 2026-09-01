import { ROLES } from './roles';
import { ROUTES } from './routes';

// Icon strings are emoji or text — replace with icon library if desired
export const SIDEBAR_ITEMS = {
  [ROLES.BUSINESS_OWNER]: [
    { label: 'Gabatee',           path: ROUTES.OWNER_DASHBOARD,    icon: '🏠' },
    { label: 'Iyyata Koo',        path: ROUTES.OWNER_APPLICATIONS, icon: '📋' },
    { label: 'Iyyata Haaraa',     path: ROUTES.OWNER_APP_NEW,      icon: '➕' },
    { label: 'Sirreeffama',       path: ROUTES.OWNER_CORRECTIONS,  icon: '✏️' },
    { label: "Maqaa Ragga'e",     path: '/owner/approval-messages', icon: '📬' },
    { label: 'Notifications',     path: ROUTES.OWNER_NOTIFICATIONS,icon: '🔔' },
    { divider: true },
    { label: 'My Profile',        path: ROUTES.OWNER_PROFILE,      icon: '👤' },
  ],

  [ROLES.FINANCIAL_OFFICER]: [
    { label: 'Dashboard',          path: '/communication/dashboard',     icon: '🏠' },
    { label: 'Incoming Applications', path: '/communication/applications', icon: '📨' },
    { label: 'Messages',           path: '/communication/messages',      icon: '💬' },
    { label: 'Notifications',      path: '/communication/notifications', icon: '🔔' },
    { divider: true },
    { label: 'Profile',            path: '/communication/profile',       icon: '👤' },
  ],

  [ROLES.LANGUAGE_OFFICER]: [
    { label: 'Dashboard',              path: '/turizm/dashboard',       icon: '🏠' },
    { label: 'Language Review Queue',  path: '/turizm/reviews',         icon: '🌍' },
    { label: 'Notifications',          path: '/turizm/notifications',   icon: '🔔' },
    { divider: true },
    { label: 'Profile',                path: '/turizm/profile',         icon: '👤' },
  ],

  [ROLES.SENIOR_OFFICER]: [
    { label: 'Dashboard',        path: '/commercial/dashboard',       icon: '🏠' },
    { label: 'Permit Reviews',   path: '/commercial/reviews',         icon: '🏛️' },
    { label: 'Notifications',    path: '/commercial/notifications',   icon: '🔔' },
    { divider: true },
    { label: 'Profile',          path: '/commercial/profile',         icon: '👤' },
  ],

  [ROLES.ADMIN]: [
    { label: 'Dashboard',       path: ROUTES.ADMIN_DASHBOARD,      icon: '🏠' },
    { label: 'Users',           path: ROUTES.ADMIN_USERS,          icon: '👥' },
    { label: 'Business Categories', path: ROUTES.ADMIN_CATEGORIES, icon: '🗂️' },
    { label: 'Reserved Terms',  path: ROUTES.ADMIN_RESERVED_TERMS, icon: '🚫' },
    { label: 'Historical Names',path: ROUTES.ADMIN_HISTORICAL,     icon: '📚' },
    { label: 'Audit Logs',      path: ROUTES.ADMIN_AUDIT_LOGS,     icon: '🔍' },
    { label: 'Settings',        path: '/admin/settings',           icon: '⚙️' },
    { label: 'Notifications',   path: ROUTES.ADMIN_PROFILE,        icon: '🔔' },
    { divider: true },
    { label: 'Profile',         path: ROUTES.ADMIN_PROFILE,        icon: '👤' },
  ],
};
