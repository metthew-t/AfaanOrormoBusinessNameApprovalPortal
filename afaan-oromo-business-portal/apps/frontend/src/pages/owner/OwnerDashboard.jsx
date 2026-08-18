import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { useSettings } from '@/context/SettingsContext';
import { getMyApplications } from '@/services/applicationService';
import { APPLICATION_STATUS, STATUS_LABELS, STATUS_BADGE_VARIANT } from '@/constants/statuses';
import { formatDate } from '@/utils/formatters';
import { buildPath } from '@/constants/routes';
import { StatCard } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { SkeletonStats } from '@/components/ui/Skeleton';
import styles from './OwnerDashboard.module.css';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { getSetting } = useSettings();
  const { data, loading, error, refetch } = useAsync(() => getMyApplications(), []);

  const apps = data ?? [];

  const total    = apps.length;
  const pending  = apps.filter((a) => [
    APPLICATION_STATUS.SUBMITTED,
    APPLICATION_STATUS.PERMISSION_PENDING,
    APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED,
    APPLICATION_STATUS.PERMISSION_APPROVED,
    APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING,
    APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED,
    APPLICATION_STATUS.APPEAL_SUBMITTED,
    APPLICATION_STATUS.APPEAL_UNDER_REVIEW,
  ].includes(a.status)).length;
  const approved = apps.filter((a) => a.status === APPLICATION_STATUS.APPROVED || a.status === APPLICATION_STATUS.APPEAL_APPROVED).length;
  const rejected = apps.filter((a) => [APPLICATION_STATUS.PERMISSION_REJECTED, APPLICATION_STATUS.LANGUAGE_REJECTED, APPLICATION_STATUS.APPEAL_REJECTED].includes(a.status)).length;

  const columns = [
    { key: 'applicationNumber', label: 'Lakkoofsa Iyyataa', width: 160 },
    { key: 'businessName',      label: 'Maqaa Daldala' },
    { key: 'category',          label: 'Gosa', render: (v) => v?.name ?? '—' },
    { key: 'createdAt',         label: 'Guyyaa',  render: (v) => formatDate(v) },
    {
      key: 'status',
      label: 'Haala',
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: 'id',
      label: 'Gocha',
      align: 'right',
      render: (id) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/owner/applications/${id}`)}
        >
          Ilaali →
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>{getSetting('owner_dashboard_title', 'Gabatee')}</h1>
        <p>{getSetting('owner_dashboard_message', 'Baga nagaan dhuftan. Kunoo ilaalchi waligalaa iyyata maqaa daldalaa keessanii.')}</p>
      </div>

      {loading ? (
        <SkeletonStats count={4} />
      ) : (
        <div className="stats-grid">
          <StatCard icon="📋" value={total}    label="Iyyata Waligalaa" />
          <StatCard icon="⏳" value={pending}  label="Eegumsaa Jala" />
          <StatCard icon="✅" value={approved} label="Fudhataman" />
          <StatCard icon="❌" value={rejected} label="Didan" />
        </div>
      )}

      {/* Quick actions */}
      <div className={styles.actions}>
        <Button onClick={() => navigate('/owner/applications/new')}>
          + Iyyata Haaraa
        </Button>
        <Button variant="secondary" onClick={() => navigate('/owner/applications')}>
          Iyyata Hunda Ilaali
        </Button>
        <Button variant="secondary" onClick={() => navigate('/owner/approval-messages')}>
          Ergaa Ragga
        </Button>
      </div>

      {/* Recent applications */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2>{getSetting('owner_recent_apps_title', 'Iyyata Yeroo Dhihoo')}</h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/owner/applications')}>
            Hunda ilaali →
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={apps.slice(0, 5)}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📋"
          emptyTitle="Iyyanni tokkollee hin jiru"
          emptyMessage="Iyyata maqaa daldala keessan jalqabaa dhiyeessaa."
        />
      </div>
    </div>
  );
}
