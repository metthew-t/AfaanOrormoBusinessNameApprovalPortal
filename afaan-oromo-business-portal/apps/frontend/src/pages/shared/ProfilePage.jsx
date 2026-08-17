import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, changePassword } from '@/services/authService';
import { extractErrorMessage } from '@/utils/apiHelpers';
import { ROLE_LABELS } from '@/constants/roles';
import { USER_STATUS_LABELS, USER_STATUS_BADGE } from '@/constants/statuses';
import { formatDate, getInitials } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import styles from './ProfilePage.module.css';

const TABS = [
  { key: 'profile',  label: 'Profile' },
  { key: 'password', label: 'Change Password' },
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('profile');

  // Profile edit state
  const [editing, setEditing]   = useState(false);
  const [profForm, setProfForm] = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' });
  const [profLoading, setProfLoading] = useState(false);
  const [profError, setProfError]     = useState(null);

  // Password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError]     = useState(null);

  const initials = getInitials(user?.fullName ?? 'User');

  // ── Save profile ──────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfLoading(true);
    setProfError(null);
    try {
      await updateProfile(profForm);
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch (err) {
      setProfError(extractErrorMessage(err));
    } finally {
      setProfLoading(false);
    }
  };

  // ── Change password ───────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    setPwError(null);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully.');
    } catch (err) {
      setPwError(extractErrorMessage(err));
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your account information and security settings.</p>
      </div>

      <div className={styles.layout}>
        {/* ── Left: Avatar card ────────────────────────────────── */}
        <div className={styles.avatarCard}>
          <div className={styles.avatar}>{initials}</div>
          <h2 className={styles.userName}>{user?.fullName}</h2>
          <p className={styles.userEmail}>{user?.email}</p>
          <span className={`badge badge-primary ${styles.roleBadge}`}>
            {user?.role ? ROLE_LABELS[user.role] : ''}
          </span>
          <div className={styles.statusRow}>
            <span className={`badge badge-${USER_STATUS_BADGE[user?.status] ?? 'neutral'}`}>
              {USER_STATUS_LABELS[user?.status] ?? user?.status}
            </span>
          </div>
          <div className={styles.metaList}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Member since</span>
              <span className={styles.metaValue}>{formatDate(user?.createdAt)}</span>
            </div>
            {user?.nationalIdRef && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>National ID Ref</span>
                <span className={styles.metaValue}>{user.nationalIdRef}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Tabs ──────────────────────────────────────── */}
        <div className={styles.tabCard}>
          <div className={styles.tabs} role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`${styles.tab} ${tab === t.key ? styles.activeTab : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {/* ─ Profile tab ─ */}
            {tab === 'profile' && (
              <form onSubmit={handleSaveProfile}>
                {profError && (
                  <Alert variant="danger" onClose={() => setProfError(null)} style={{ marginBottom: 16 }}>
                    {profError}
                  </Alert>
                )}

                <div className={styles.fieldGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Full Name</label>
                    {editing ? (
                      <Input
                        value={profForm.fullName}
                        onChange={(e) => setProfForm({ ...profForm, fullName: e.target.value })}
                        required
                      />
                    ) : (
                      <p className={styles.fieldValue}>{user?.fullName}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Email Address</label>
                    <p className={styles.fieldValue}>{user?.email}</p>
                    <span className={styles.fieldNote}>Email cannot be changed.</span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Phone Number</label>
                    {editing ? (
                      <Input
                        value={profForm.phone}
                        onChange={(e) => setProfForm({ ...profForm, phone: e.target.value })}
                      />
                    ) : (
                      <p className={styles.fieldValue}>{user?.phone ?? '—'}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Role</label>
                    <p className={styles.fieldValue}>{user?.role ? ROLE_LABELS[user.role] : '—'}</p>
                  </div>
                </div>

                <div className={styles.actions}>
                  {editing ? (
                    <>
                      <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" loading={profLoading}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* ─ Password tab ─ */}
            {tab === 'password' && (
              <form onSubmit={handleChangePassword}>
                {pwError && (
                  <Alert variant="danger" onClose={() => setPwError(null)} style={{ marginBottom: 16 }}>
                    {pwError}
                  </Alert>
                )}

                <div className={styles.pwFields}>
                  <Input
                    label="Current Password"
                    type="password"
                    showToggle
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    showToggle
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    hint="Minimum 8 characters, including uppercase, lowercase and number."
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    showToggle
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.actions}>
                  <Button type="submit" loading={pwLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
