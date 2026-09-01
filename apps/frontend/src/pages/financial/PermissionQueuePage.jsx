import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getPermissionQueue } from '@/services/permissionService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function PermissionQueuePage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => getPermissionQueue(), []);

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName',      label: 'Business Name' },
    { key: 'owner',             label: 'Business Owner', render: (v) => v?.fullName ?? '—' },
    { key: 'category',          label: 'Category', render: (v) => v?.name ?? '—' },
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
        <h1>Permission Queue</h1>
        <p>Review business permission documents for submitted applications.</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📂"
          emptyTitle="No applications in queue"
        />
      </div>
    </div>
  );
}
