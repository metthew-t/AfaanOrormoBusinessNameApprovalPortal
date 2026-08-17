import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationContext';
import { formatDate } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import styles from './NotificationBell.module.css';

const TYPE_ICON = {
  success: '✓',
  warning: '⚠',
  danger:  '✕',
  info:    'ℹ',
};

const TYPE_COLOR = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  info:    'var(--color-info)',
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const notifPath = role ? `/${role.toLowerCase().replace('_officer','').replace('business_owner','owner')}/notifications` : '/';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    setOpen(false);
    if (notif.actionUrl) navigate(notif.actionUrl);
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <div className={styles.wrapper} ref={dropRef}>
      <button
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        🔔
        {unreadCount > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="region" aria-label="Notifications">
          <div className={styles.dropHeader}>
            <span className={styles.dropTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button className={styles.markAll} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 && (
              <div className={styles.empty}>No notifications yet</div>
            )}
            {notifications.slice(0, 6).map((n) => (
              <button
                key={n.id}
                className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
                onClick={() => handleClick(n)}
              >
                <span
                  className={styles.typeIcon}
                  style={{ background: `${TYPE_COLOR[n.type]}22`, color: TYPE_COLOR[n.type] }}
                >
                  {TYPE_ICON[n.type] ?? 'ℹ'}
                </span>
                <div className={styles.content}>
                  <p className={styles.itemTitle}>{n.title}</p>
                  <p className={styles.itemMsg}>{n.message}</p>
                  <p className={styles.itemTime}>{formatRelativeTime(n.timestamp)}</p>
                </div>
                {!n.isRead && <span className={styles.dot} aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className={styles.dropFooter}>
            <button
              className={styles.viewAll}
              onClick={() => { setOpen(false); navigate(notifPath); }}
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
