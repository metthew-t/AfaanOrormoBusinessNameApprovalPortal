import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getHistoricalNames, importHistoricalNames, addHistoricalName } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import toast from 'react-hot-toast';

export default function AdminHistoricalNames() {
  const { data, loading, error, refetch } = useAsync(() => getHistoricalNames(), []);
  
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  
  const [businessName, setBusinessName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const columns = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'normalizedBusinessName', label: 'Normalized' },
    { key: 'source', label: 'Source' },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (isActive) => (
        <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'createdAt', label: 'Imported At', render: formatDate },
  ];

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addHistoricalName({ businessName });
      toast.success('Historical name added successfully');
      setManualModalOpen(false);
      setBusinessName('');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add historical name');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    
    setImporting(true);
    try {
      const res = await importHistoricalNames(importFile);
      toast.success(res?.data?.message || 'CSV imported successfully');
      setImportModalOpen(false);
      setImportFile(null);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const names = data?.data || data || [];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>📚 Historical Business Names</h1>
          <p>Registry of existing business names to prevent duplicates during new applications.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => setImportModalOpen(true)}>Import CSV</Button>
          <Button onClick={() => setManualModalOpen(true)}>+ Add Entry</Button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={names}
          keyField="id"
        />
      </div>

      {/* Add Manual Entry Modal */}
      <Modal 
        open={manualModalOpen} 
        onClose={() => !submitting && setManualModalOpen(false)} 
        title="Add Historical Name Manually"
      >
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Business Name"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Oromia International Bank"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setManualModalOpen(false)} type="button" disabled={submitting}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Entry</Button>
          </div>
        </form>
      </Modal>

      {/* Import CSV Modal */}
      <Modal
        open={importModalOpen}
        onClose={() => !importing && setImportModalOpen(false)}
        title="Import Historical Names"
      >
        <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Upload a CSV file containing business names. The CSV should have a column named <strong>businessName</strong>.
          </p>
          <FileUpload
            label="Select CSV File"
            accept=".csv"
            onFileSelect={(file) => setImportFile(file)}
            onRemove={() => setImportFile(null)}
            currentFile={importFile}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setImportModalOpen(false)} type="button" disabled={importing}>Cancel</Button>
            <Button type="submit" loading={importing} disabled={!importFile}>Import File</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
