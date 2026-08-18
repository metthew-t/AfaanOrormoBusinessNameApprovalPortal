import { useAsync } from '@/hooks/useAsync';
import { getAuditLogs } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

export default function AdminAuditLogs() {
  const { data, loading, error, refetch } = useAsync(() => getAuditLogs(), []);

  const columns = [
    { key: 'createdAt', label: 'Timestamp', render: formatDate },
    { 
      key: 'actor', 
      label: 'Actor',
      render: (actor) => actor?.fullName || actor?.email || 'System'
    },
    { 
      key: 'action', 
      label: 'Action',
      render: (action) => <span style={{ fontWeight: '500' }}>{action}</span>
    },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'entityId', label: 'Entity ID' },
    { key: 'ipAddress', label: 'IP Address' },
  ];

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const logs = data?.data || data || [];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>🔍 Audit Logs</h1>
        <p>System-wide record of all administrative and user actions.</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={logs}
          keyField="id"
        />
      </div>
    </div>
  );
}
