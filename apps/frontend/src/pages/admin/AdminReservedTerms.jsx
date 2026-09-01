import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getReservedTerms, createReservedTerm, updateReservedTerm, deleteReservedTerm } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import toast from 'react-hot-toast';

export default function AdminReservedTerms() {
  const { data, loading, error, refetch } = useAsync(() => getReservedTerms(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [editingTerm, setEditingTerm] = useState(null); // Track which term is being edited
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, term: null, loading: false });

  const columns = [
    { key: 'term', label: 'Restricted Term' },
    { key: 'normalizedTerm', label: 'Normalized' },
    { 
      key: 'createdBy', 
      label: 'Added By',
      render: (createdBy) => createdBy?.fullName || createdBy?.email || 'Admin'
    },
    { key: 'createdAt', label: 'Date Added', render: formatDate },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, term) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(term)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialog({ open: true, term, loading: false })}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTerm) {
        // Update existing term
        await updateReservedTerm(editingTerm.id, { term });
        toast.success('Reserved term updated successfully');
      } else {
        // Create new term
        await createReservedTerm({ term });
        toast.success('Reserved term added successfully');
      }
      setModalOpen(false);
      setTerm('');
      setEditingTerm(null);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${editingTerm ? 'update' : 'add'} reserved term`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (termData) => {
    setEditingTerm(termData);
    setTerm(termData.term);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setModalOpen(false);
      setTerm('');
      setEditingTerm(null);
    }
  };

  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await deleteReservedTerm(deleteDialog.term.id);
      toast.success('Reserved term deleted successfully');
      setDeleteDialog({ open: false, term: null, loading: false });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete reserved term');
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const terms = data?.data || data || [];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🚫 Reserved Terms</h1>
          <p>Words and phrases that are blocked from being used in business names.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Term</Button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={terms}
          keyField="id"
        />
      </div>

      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal}
        title={editingTerm ? 'Edit Reserved Term' : 'Add Reserved Term'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Term to Restrict"
            required
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. mootummaa, banka"
            helpText="This word will be blocked when users apply for a new business name."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={handleCloseModal} type="button" disabled={submitting}>Cancel</Button>
            <Button type="submit" loading={submitting}>
              {editingTerm ? 'Update Term' : 'Add Term'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.loading && setDeleteDialog({ open: false, term: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete Reserved Term"
        message={
          <span>
            Are you sure you want to delete <strong>"{deleteDialog.term?.term}"</strong> from the reserved list?
            Users will be able to register this word in their business names.
          </span>
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
}
