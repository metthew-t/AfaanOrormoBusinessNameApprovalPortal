import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getUsers, createUser, toggleUserStatus } from '@/services/adminService';
import { ROLE_LABELS } from '@/constants/roles';
import { formatDate } from '@/utils/formatters';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { data, loading, error, refetch } = useAsync(() => getUsers(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'BUSINESS_OWNER',
    phone: '',
  });

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role', 
      render: (role) => ROLE_LABELS[role] || role
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (status, user) => {
        const isActive = status === 'ACTIVE' || user.isActive === true;
        return (
          <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    { key: 'createdAt', label: 'Joined', render: formatDate },
  ];

  const handleToggleStatus = async (user) => {
    try {
      const isActive = user.status === 'ACTIVE' || user.isActive === true;
      const newStatus = !isActive;
      await toggleUserStatus(user.id, newStatus ? 'ACTIVE' : 'INACTIVE');
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(formData);
      toast.success('User created successfully');
      setModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', role: 'BUSINESS_OWNER', phone: '' });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const users = data?.data || data || [];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>👥 User Management</h1>
          <p>Manage system users, officers, and their access levels.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          keyField="id"
          actions={(user) => {
            const isActive = user.status === 'ACTIVE' || user.isActive === true;
            return (
              <Button
                variant={isActive ? 'danger' : 'success'}
                size="sm"
                onClick={() => handleToggleStatus(user)}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </Button>
            );
          }}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Temporary Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Select
            label="Role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit" loading={submitting}>Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
