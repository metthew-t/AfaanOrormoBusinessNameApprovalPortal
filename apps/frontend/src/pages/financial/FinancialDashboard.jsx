import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getPermissionQueue, getFinancialDashboardStats } from '@/services/permissionService';
import { formatDate } from '@/utils/formatters';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function FinancialDashboard() {
  const navigate = useNavigate();
  const { data: stats, loading: statsLoading } = useAsync(() => getFinancialDashboardStats(), []);
  const { data, loading, error, refetch }      = useAsync(() => getPermissionQueue(), []);

  const queue = data ?? [];

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName',      label: 'Business Name' },
    { key: 'owner',             label: 'Business Owner', render: (v) => v?.fullName ?? '—' },
    { key: 'submittedAt',       label: 'Submitted', render: (v) => formatDate(v) },
    { key: 'status',            label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/financial/permissions/${id}`)}>
          Review →
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <h1>Financial Officer Dashboard</h1>
        <p>Review and process business permission documents.</p>
      </div>

      {statsLoading ? <SkeletonStats count={4} /> : (
        <div className="stats-grid">
          <StatCard icon="⏳" value={stats?.pending ?? 0}            label="Pending Verification" />
          <StatCard icon="✅" value={stats?.approved ?? 0}           label="Approved" />
          <StatCard icon="❌" value={stats?.rejected ?? 0}           label="Rejected" />
          <StatCard icon="✏️" value={stats?.correctionRequired ?? 0} label="Correction Required" />
        </div>
      )}

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2>Permission Queue</h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/financial/permissions')}>
            View all →
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={queue.slice(0, 8)}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📂"
          emptyTitle="No applications in queue"
          emptyMessage="There are no permission documents awaiting review."
        />
      </div>
    </div>
  );
}
