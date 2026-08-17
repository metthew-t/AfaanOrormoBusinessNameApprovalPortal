import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getNotifications, markNotificationRead, markAllRead } from '@/services/notificationService';
import { formatRelative } from '@/utils/formatters';
import Button from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './NotificationsPage.module.css';

const TYPE_COLORS = {
  SUCCESS: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: '✓' },
  WARNING: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: '⚠' },
  DANGER:  { bg: 'var(--color-danger-bg)',  color: 'var(--color-danger)',  icon: '✕' },
  INFO:    { bg: 'var(--color-info-bg)',     color: 'var(--color-info)',    icon: 'ℹ' },
};

export default function NotificationsPage() {
  const toast    = useToast();
  const navigate = useNavigate();

  const { data: notifications, loading, error, refetch } = useAsync(
    () => getNotifications(),
    []
  );

  const list = notifications ?? [];
  const unread = list.filter((n) => !n.read).length;

  const handleMarkAll = async () => {
    await markAllRead();
    refetch();
    toast.success('All notifications marked as read.');
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
      refetch();
    }
    if (notif.link) navigate(notif.link);
  };

  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          {unread > 0 && (
            <p>{unread} unread notification{unread !== 1 ? 's' : ''}</p>
          )}
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          message="You have no notifications yet."
        />
      ) : (
        <div className={styles.list}>
          {list.map((notif) => {
            const t = TYPE_COLORS[notif.type] ?? TYPE_COLORS.INFO;
            return (
              <button
                key={notif.id}
                className={`${styles.item} ${!notif.read ? styles.unread : ''}`}
                onClick={() => handleClick(notif)}
              >
                <div
                  className={styles.typeIcon}
                  style={{ background: t.bg, color: t.color }}
                >
                  {t.icon}
                </div>

                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <span className={styles.title}>{notif.title}</span>
                    {!notif.read && <span className={styles.dot} aria-label="Unread" />}
                  </div>
                  <p className={styles.message}>{notif.message}</p>
                  <p className={styles.time}>{formatRelative(notif.createdAt)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
