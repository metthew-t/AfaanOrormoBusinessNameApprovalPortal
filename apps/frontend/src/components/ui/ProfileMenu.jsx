import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/constants/roles';
import { getInitials } from '@/utils/formatters';
import styles from './ProfileMenu.module.css';

const PROFILE_PATHS = {
  BUSINESS_OWNER:    '/owner/profile',
  FINANCIAL_OFFICER: '/financial/profile',
  LANGUAGE_OFFICER:  '/language/profile',
  SENIOR_OFFICER:    '/senior/profile',
  ADMIN:             '/admin/profile',
};

export default function ProfileMenu() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goTo = (path) => { setOpen(false); navigate(path); };

  const profilePath = role ? PROFILE_PATHS[role] : '/';
  const initials    = getInitials(user?.fullName ?? 'User');

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Profile menu"
      >
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.info}>
          <span className={styles.name}>{user?.fullName ?? 'User'}</span>
          <span className={styles.role}>{role ? ROLE_LABELS[role] : ''}</span>
        </div>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.header}>
            <div className={styles.avatarLg}>{initials}</div>
            <div>
              <p className={styles.headerName}>{user?.fullName}</p>
              <p className={styles.headerEmail}>{user?.email}</p>
              <span className={`badge badge-success ${styles.roleBadge}`}>
                {role ? ROLE_LABELS[role] : ''}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <button className={styles.menuItem} onClick={() => goTo(profilePath)} role="menuitem">
            <span>👤</span> My Profile
          </button>
          <button className={styles.menuItem} onClick={() => goTo(profilePath + '?tab=password')} role="menuitem">
            <span>🔒</span> Change Password
          </button>

          <div className={styles.divider} />

          <button
            className={`${styles.menuItem} ${styles.logout}`}
            onClick={handleLogout}
            role="menuitem"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
