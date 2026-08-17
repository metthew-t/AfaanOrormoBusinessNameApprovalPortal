import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getAdminDashboardStats, getRecentTransactions, getSystemHealth } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import { StatCard } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, loading: statsLoading } = useAsync(() => getAdminDashboardStats(), []);
  const { data: transactions, loading: transLoading } = useAsync(() => getRecentTransactions(), []);
  const { data: health } = useAsync(() => getSystemHealth(), []);

  const recentTrans = (transactions ?? []).slice(0, 10);

  const transactionColumns = [
    { 
      key: 'timestamp', 
      label: 'Time', 
      width: 160,
      render: (v) => formatDate(v) 
    },
    { key: 'actor', label: 'User' },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target', render: (v) => v || '—' },
    { 
      key: 'status', 
      label: 'Status',
      render: (v) => (
        <span className={`badge badge-${v === 'SUCCESS' ? 'success' : 'danger'}`}>
          {v}
        </span>
      )
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className="page-header">
        <h1>Admin (IT Biro) Dashboard</h1>
        <p>Monitor all system transactions, user activities, and system health</p>
      </div>

      {/* System Overview Stats */}
      {statsLoading ? (
        <SkeletonStats count={6} />
      ) : (
        <div className={styles.statsGrid}>
          <StatCard 
            icon="👥" 
            value={stats?.totalUsers ?? 0} 
            label="Total Users" 
            variant="primary"
          />
          <StatCard 
            icon="📋" 
            value={stats?.totalApplications ?? 0} 
            label="Total Applications" 
            variant="info"
          />
          <StatCard 
            icon="⏳" 
            value={stats?.pendingReviews ?? 0} 
            label="Pending Reviews" 
            variant="warning"
          />
          <StatCard 
            icon="✅" 
            value={stats?.approvedToday ?? 0} 
            label="Approved Today" 
            variant="success"
          />
          <StatCard 
            icon="🔄" 
            value={stats?.transactionsToday ?? 0} 
            label="Transactions Today" 
            variant="info"
          />
          <StatCard 
            icon="⚡" 
            value={health?.status === 'HEALTHY' ? '100%' : health?.uptime ?? '—'} 
            label="System Uptime" 
            variant={health?.status === 'HEALTHY' ? 'success' : 'danger'}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>System Management</h3>
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionCard}
            onClick={() => navigate('/admin/users')}
          >
            <div className={styles.actionIcon}>👥</div>
            <div className={styles.actionContent}>
              <h4>User Management</h4>
              <p>Manage user accounts and permissions</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/admin/audit-logs')}
          >
            <div className={styles.actionIcon}>🔍</div>
            <div className={styles.actionContent}>
              <h4>Audit Logs</h4>
              <p>View detailed system audit trail</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/admin/categories')}
          >
            <div className={styles.actionIcon}>🗂️</div>
            <div className={styles.actionContent}>
              <h4>Business Categories</h4>
              <p>Manage business category definitions</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => navigate('/admin/reserved-terms')}
          >
            <div className={styles.actionIcon}>🚫</div>
            <div className={styles.actionContent}>
              <h4>Reserved Terms</h4>
              <p>Manage prohibited business names</p>
            </div>
          </button>
        </div>
      </div>

      {/* Department Activity */}
      <div className={styles.departmentActivity}>
        <h3>Department Activity Overview</h3>
        <div className={styles.departmentGrid}>
          <div className={styles.deptCard}>
            <div className={styles.deptHeader}>
              <span className={styles.deptIcon}>📡</span>
              <h4>Communication Biro</h4>
            </div>
            <div className={styles.deptStats}>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.communication?.routed ?? 0}</span>
                <span className={styles.deptStatLabel}>Routed</span>
              </div>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.communication?.messages ?? 0}</span>
                <span className={styles.deptStatLabel}>Messages</span>
              </div>
            </div>
          </div>

          <div className={styles.deptCard}>
            <div className={styles.deptHeader}>
              <span className={styles.deptIcon}>🏛️</span>
              <h4>Commercial Office</h4>
            </div>
            <div className={styles.deptStats}>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.commercial?.approved ?? 0}</span>
                <span className={styles.deptStatLabel}>Approved</span>
              </div>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.commercial?.rejected ?? 0}</span>
                <span className={styles.deptStatLabel}>Rejected</span>
              </div>
            </div>
          </div>

          <div className={styles.deptCard}>
            <div className={styles.deptHeader}>
              <span className={styles.deptIcon}>🌍</span>
              <h4>Addaf Turizm Biro</h4>
            </div>
            <div className={styles.deptStats}>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.turizm?.approved ?? 0}</span>
                <span className={styles.deptStatLabel}>Approved</span>
              </div>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.turizm?.rejected ?? 0}</span>
                <span className={styles.deptStatLabel}>Rejected</span>
              </div>
            </div>
          </div>

          <div className={styles.deptCard}>
            <div className={styles.deptHeader}>
              <span className={styles.deptIcon}>👤</span>
              <h4>Business Owners</h4>
            </div>
            <div className={styles.deptStats}>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.owners?.active ?? 0}</span>
                <span className={styles.deptStatLabel}>Active</span>
              </div>
              <div className={styles.deptStat}>
                <span className={styles.deptStatValue}>{stats?.owners?.newToday ?? 0}</span>
                <span className={styles.deptStatLabel}>New Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2>Recent System Transactions</h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/admin/audit-logs')}>
            View all →
          </Button>
        </div>
        <DataTable
          columns={transactionColumns}
          data={recentTrans}
          loading={transLoading}
          emptyIcon="📊"
          emptyTitle="No transactions recorded"
          emptyMessage="System transaction history will appear here."
        />
      </div>

      {/* System Health */}
      {health && (
        <div className={styles.systemHealth}>
          <h3>System Health</h3>
          <div className={styles.healthGrid}>
            <div className={styles.healthCard}>
              <div className={styles.healthIndicator} data-status={health.database}>
                <span className={styles.healthDot}></span>
              </div>
              <div>
                <h4>Database</h4>
                <p className={styles.healthStatus}>{health.database}</p>
              </div>
            </div>

            <div className={styles.healthCard}>
              <div className={styles.healthIndicator} data-status={health.api}>
                <span className={styles.healthDot}></span>
              </div>
              <div>
                <h4>API Services</h4>
                <p className={styles.healthStatus}>{health.api}</p>
              </div>
            </div>

            <div className={styles.healthCard}>
              <div className={styles.healthIndicator} data-status={health.storage}>
                <span className={styles.healthDot}></span>
              </div>
              <div>
                <h4>File Storage</h4>
                <p className={styles.healthStatus}>{health.storage}</p>
              </div>
            </div>

            <div className={styles.healthCard}>
              <div className={styles.healthIndicator} data-status={health.notifications}>
                <span className={styles.healthDot}></span>
              </div>
              <div>
                <h4>Notifications</h4>
                <p className={styles.healthStatus}>{health.notifications}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
