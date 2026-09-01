import { useLocation } from 'react-router-dom';
import NotificationBell from '@/components/ui/NotificationBell';
import ProfileMenu from '@/components/ui/ProfileMenu';
import styles from './Navbar.module.css';

// Map pathname prefixes to page titles
const PAGE_TITLES = {
  '/owner/dashboard':        'Dashboard',
  '/owner/applications/new': 'New Application',
  '/owner/applications':     'My Applications',
  '/owner/corrections':      'Corrections',
  '/owner/appeals':          'Appeals',
  '/owner/certificates':     'Certificates',
  '/owner/notifications':    'Notifications',
  '/owner/profile':          'Profile',

  '/financial/dashboard':    'Dashboard',
  '/financial/permissions':  'Permission Queue',
  '/financial/notifications':'Notifications',
  '/financial/profile':      'Profile',

  '/language/dashboard':     'Dashboard',
  '/language/reviews':       'Language Review Queue',
  '/language/notifications': 'Notifications',
  '/language/profile':       'Profile',

  '/senior/dashboard':       'Dashboard',
  '/senior/appeals':         'Appeals',
  '/senior/notifications':   'Notifications',
  '/senior/profile':         'Profile',

  '/admin/dashboard':        'Dashboard',
  '/admin/users':            'User Management',
  '/admin/categories':       'Business Categories',
  '/admin/reserved-terms':   'Reserved Terms',
  '/admin/historical-names': 'Historical Names',
  '/admin/audit-logs':       'Audit Logs',
  '/admin/profile':          'Profile',
};

function getPageTitle(pathname) {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Prefix match (for detail pages like /owner/applications/:id)
  const found = Object.keys(PAGE_TITLES)
    .filter((k) => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return found ? PAGE_TITLES[found] : 'AOBNAP';
}

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className={styles.navbar} role="banner">
      {/* Left: menu button (mobile) + page title */}
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className={styles.titleWrap}>
          <span className={styles.logoText}>AOBNAP</span>
          <span className={styles.titleSep} aria-hidden="true">|</span>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className={styles.right}>
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}
