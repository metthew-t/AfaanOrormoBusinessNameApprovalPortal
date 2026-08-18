import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { data, loading, error, refetch } = useAsync(() => getCategories(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null, loading: false });

  const columns = [
    { key: 'name', label: 'Category Name' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (status, cat) => {
        const isActive = status === 'ACTIVE' || cat.isActive === true;
        return (
          <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    { key: 'createdAt', label: 'Created At', render: formatDate },
  ];

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: categoryName });
        toast.success('Category updated successfully');
      } else {
        await createCategory({ name: categoryName });
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    try {
      await deleteCategory(deleteDialog.category.id);
      toast.success('Category deleted successfully');
      setDeleteDialog({ open: false, category: null, loading: false });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const categories = data?.data || data || [];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🗂️ Business Categories</h1>
          <p>Manage the list of allowed business categories for new applications.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Add Category</Button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={categories}
          keyField="id"
          actions={(category) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenModal(category)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteDialog({ open: true, category, loading: false })}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>

      <Modal 
        open={modalOpen} 
        onClose={() => !submitting && setModalOpen(false)} 
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Category Name"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Technology Services"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)} type="button" disabled={submitting}>Cancel</Button>
            <Button type="submit" loading={submitting}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.loading && setDeleteDialog({ open: false, category: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
      />
    </div>
  );
}
