import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getCommercialQueue } from '@/services/commercialService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function CommercialQueuePage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => getCommercialQueue(), []);

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName', label: 'Business Name' },
    { 
      key: 'owner', 
      label: 'Business Owner', 
      render: (v) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v?.fullName ?? '—'}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {v?.email ?? ''}
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'receivedAt', label: 'Received', render: (v) => formatDate(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/commercial/reviews/${id}`)}>
          Review →
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400 }}>
      <div className="page-header">
        <h1>Commercial Review Queue</h1>
        <p>Review business permission certificates and commercial documentation</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="🏛️"
          emptyTitle="No applications in queue"
          emptyMessage="All business permits have been reviewed."
        />
      </div>
    </div>
  );
}
