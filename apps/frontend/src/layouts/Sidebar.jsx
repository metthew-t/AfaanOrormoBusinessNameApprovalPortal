import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SIDEBAR_ITEMS } from '@/constants/sidebar';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const items = (role && SIDEBAR_ITEMS[role]) ?? [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>🌿</div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>AOBNAP</span>
          <span className={styles.brandSub}>Oromia Trade Bureau</span>
        </div>
        {/* Mobile close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>

      {/* Nav items */}
      <nav className={styles.nav} aria-label="Sidebar navigation">
        {items.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className={styles.divider} />;
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              end={item.path.endsWith('/dashboard')}
            >
              <span className={styles.itemIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.itemLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: Logout */}
      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.itemIcon} aria-hidden="true">🚪</span>
          <span className={styles.itemLabel}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
