import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getTurizmQueue, getTurizmStats } from '@/services/turizmService';
import { formatDate } from '@/utils/formatters';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function TurizmDashboard() {
  const navigate = useNavigate();
  const { data: stats, loading: statsLoading } = useAsync(() => getTurizmStats(), []);
  const { data, loading, error, refetch } = useAsync(() => getTurizmQueue(), []);

  const recentApps = (data ?? []).slice(0, 8);

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName', label: 'Business Name' },
    { key: 'owner', label: 'Business Owner', render: (v) => v?.fullName ?? '—' },
    { key: 'receivedAt', label: 'Received', render: (v) => formatDate(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/turizm/reviews/${id}`)}>
          Review →
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <h1>Addaf Turizm Biro Dashboard</h1>
        <p>Review business descriptions for Afaan Oromo language compliance and cultural appropriateness</p>
      </div>

      {statsLoading ? (
        <SkeletonStats count={3} />
      ) : (
        <div className="stats-grid">
          <StatCard 
            icon="⏳" 
            value={stats?.pending ?? 0} 
            label="Pending Review" 
            variant="warning"
          />
          <StatCard 
            icon="✅" 
            value={stats?.approved ?? 0} 
            label="Approved" 
            variant="success"
          />
          <StatCard 
            icon="❌" 
            value={stats?.rejected ?? 0} 
            label="Rejected" 
            variant="danger"
          />
        </div>
      )}

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2>Description Review Queue</h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/turizm/reviews')}>
            View all →
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={recentApps}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="🌍"
          emptyTitle="No applications in queue"
          emptyMessage="There are no business descriptions awaiting language review."
        />
      </div>
    </div>
  );
}
