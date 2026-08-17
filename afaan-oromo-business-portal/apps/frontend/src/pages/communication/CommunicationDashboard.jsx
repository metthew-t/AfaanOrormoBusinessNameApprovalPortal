import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getIncomingApplications, getCommunicationStats } from '@/services/communicationService';
import { formatDate } from '@/utils/formatters';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import styles from './CommunicationDashboard.module.css';

export default function CommunicationDashboard() {
  const navigate = useNavigate();
  const { data: stats, loading: statsLoading } = useAsync(() => getCommunicationStats(), []);
  const { data, loading, error, refetch } = useAsync(() => getIncomingApplications(), []);

  const recentApps = (data ?? []).slice(0, 8);

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName', label: 'Business Name' },
    { key: 'owner', label: 'Business Owner', render: (v) => v?.fullName ?? '—' },
    { key: 'submittedAt', label: 'Received', render: (v) => formatDate(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/communication/applications/${id}`)}>
          Process →
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className="page-header">
        <h1>Communication Biro Dashboard</h1>
        <p>Coordinate application workflow and route to specialized departments</p>
      </div>

      {/* Statistics */}
      {statsLoading ? (
        <SkeletonStats count={4} />
      ) : (
        <div className="stats-grid">
          <StatCard 
            icon="📨" 
            value={stats?.newApplications ?? 0} 
            label="New Applications" 
            variant="primary"
          />
          <StatCard 
            icon="🔄" 
            value={stats?.inProgress ?? 0} 
            label="In Progress" 
            variant="warning"
          />
          <StatCard 
            icon="✅" 
            value={stats?.completed ?? 0} 
            label="Completed" 
            variant="success"
          />
          <StatCard 
            icon="💬" 
            value={stats?.unreadMessages ?? 0} 
            label="Unread Messages" 
            variant="info"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionCard}
            onClick={() => navigate('/communication/applications')}
          >
            <div className={styles.actionIcon}>📋</div>
            <div className={styles.actionContent}>
              <h4>Incoming Applications</h4>
              <p>Review and route new applications</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/communication/messages')}
          >
            <div className={styles.actionIcon}>💬</div>
            <div className={styles.actionContent}>
              <h4>Messages</h4>
              <p>View communications from departments</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/communication/from-commercial')}
          >
            <div className={styles.actionIcon}>🏛️</div>
            <div className={styles.actionContent}>
              <h4>From Commercial Office</h4>
              <p>Review completed commercial reviews</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/communication/from-turizm')}
          >
            <div className={styles.actionIcon}>🌍</div>
            <div className={styles.actionContent}>
              <h4>From Addaf Turizm</h4>
              <p>Review completed language reviews</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2>Recent Applications</h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/communication/applications')}>
            View all →
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={recentApps}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📬"
          emptyTitle="No applications"
          emptyMessage="There are no applications to process at the moment."
        />
      </div>
    </div>
  );
}
