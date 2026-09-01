import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getUsers, createUser, updateUser, toggleUserStatus, deleteUser } from '@/services/adminService';
import { useSettings } from '@/context/SettingsContext';
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
  const { getSetting } = useSettings();
  const { data, loading, error, refetch } = useAsync(() => getUsers(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
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
      render: (role) => {
        const roleName = role?.name || role;
        return getSetting(`role_label_${roleName}`, ROLE_LABELS[roleName] || roleName);
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (status, user) => {
        const isActive = status === 'ACTIVE' || user.isActive === true;
        return (
          <button
            onClick={() => handleToggleStatus(user)}
            className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}
            style={{ cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
            title={`Click to ${isActive ? 'deactivate' : 'activate'}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        );
      }
    },
    { key: 'createdAt', label: 'Joined', render: formatDate },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditUser(user)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteUser(user)}
          >
            Delete
          </Button>
        </div>
      )
    }
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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '', // Don't populate password for security
      role: user.role?.name || user.role || 'BUSINESS_OWNER',
      phone: user.phoneNumber || '',
    });
    setModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) return;
    try {
      await deleteUser(user.id);
      toast.success('User deleted successfully');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        // Update existing user
        const payload = {
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          roleName: formData.role,
        };
        // Only include password if it was changed
        if (formData.password) {
          payload.password = formData.password;
        }
        await updateUser(editingUser.id, payload);
        toast.success('User updated successfully');
      } else {
        // Create new user
        await createUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          roleName: formData.role,
          phoneNumber: formData.phone,
        });
        toast.success('User created successfully');
      }
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', password: '', role: 'BUSINESS_OWNER', phone: '' });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const users = data?.users || (Array.isArray(data) ? data : []);

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
        />
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingUser(null); setFormData({ fullName: '', email: '', password: '', role: 'BUSINESS_OWNER', phone: '' }); }} title={editingUser ? "Edit User" : "Create New User"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required={!editingUser}
            disabled={editingUser}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            hint={editingUser ? "Email cannot be changed" : ""}
          />
          <Input
            label={editingUser ? "New Password (leave blank to keep current)" : "Temporary Password"}
            type="password"
            required={!editingUser}
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
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label: getSetting(`role_label_${value}`, label) }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditingUser(null); }} type="button">Cancel</Button>
            <Button type="submit" loading={submitting}>{editingUser ? 'Update User' : 'Create User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
