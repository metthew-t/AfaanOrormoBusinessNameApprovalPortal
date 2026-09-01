import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { useSettings } from '@/context/SettingsContext';
import { getMyApplications } from '@/services/applicationService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import styles from './ApplicationsPage.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Haala Hundaa' },
  { value: 'DRAFT',                          label: 'Qabiyyee' },
  { value: 'SUBMITTED',                      label: 'Dhiyaate' },
  { value: 'PERMISSION_PENDING',             label: 'Hayyama Eegumsaa Jala' },
  { value: 'PERMISSION_CORRECTION_REQUIRED', label: 'Sirreeffama Barbaachisa' },
  { value: 'PERMISSION_REJECTED',            label: 'Hayyama Didame' },
  { value: 'PERMISSION_APPROVED',            label: 'Hayyama Fudhatame' },
  { value: 'LANGUAGE_REVIEW_PENDING',        label: 'Gamaaggama Afaan Eegumsaa Jala' },
  { value: 'LANGUAGE_REJECTED',              label: 'Afaan Didame' },
  { value: 'APPROVED',                       label: 'Fudhatame' },
  { value: 'APPEAL_SUBMITTED',               label: 'Gaafii Dhiyaate' },
  { value: 'APPEAL_UNDER_REVIEW',            label: 'Gaafii Gamaaggama Jala' },
  { value: 'APPEAL_APPROVED',               label: 'Gaafii Fudhatame' },
  { value: 'APPEAL_REJECTED',               label: 'Gaafii Didame' },
];

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { getSetting } = useSettings();
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data, loading, error, refetch } = useAsync(() => getMyApplications(), []);
  const apps = data?.applications || (Array.isArray(data) ? data : []);

  const filtered = apps.filter((a) => {
    const matchStatus = !filter || a.status === filter;
    const matchSearch = !search || 
      a.proposedBusinessName?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationNumber?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    { key: 'applicationNumber', label: 'Lakkoofsa Iyyataa', width: 160 },
    { 
      key: 'proposedBusinessName', 
      label: 'Maqaa Daldala', 
      render: (v, row) => row.proposedBusinessName || row.businessName || '—' 
    },
    { 
      key: 'businessCategory', 
      label: 'Gosa Daldaala', 
      render: (cat) => cat?.name || '—'
    },
    { key: 'createdAt', label: 'Dhiyaate', render: (v) => formatDate(v) },
    { key: 'status', label: 'Haala', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/owner/applications/${id}`)}>
          Ilaali →
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{getSetting('owner_applications_title', 'Iyyata Hunda')}</h1>
          <p>{getSetting('owner_applications_message', 'Iyyata maqaa daldalaa keessanii hunda asitti to\'adhaa.')}</p>
        </div>
        <Button onClick={() => navigate('/owner/applications/new')}>
          + Iyyata Haaraa
        </Button>
      </div>

      <div className="card">
        <div className={styles.filters}>
          <input
            type="search"
            placeholder="Maqaa ykn lakkoofsa iyyataatiin barbaadi…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <Select
            options={STATUS_OPTIONS}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Haala Hundaa"
            className={styles.filterSelect}
          />
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📋"
          emptyTitle="Iyyanni tokkollee hin argamne"
          emptyMessage="Barbaaduu keessan sirreessaa ykn iyyata haaraa uumaa."
        />
      </div>
    </div>
  );
}
