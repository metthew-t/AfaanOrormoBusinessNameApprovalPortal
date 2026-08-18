import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { bulkUpdateSettings } from '@/services/settingsService';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AdminSettingsPage.module.css';

export default function AdminSettingsPage() {
  const { settings, refreshSettings, loading: ctxLoading } = useSettings();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [dirty, setDirty] = useState(false);

  // Initialize form state when settings load
  if (!dirty && Object.keys(settings).length > 0 && Object.keys(formData).length === 0) {
    setFormData(settings);
  }

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bulkUpdateSettings(formData);
      await refreshSettings();
      toast.success('Settings updated successfully');
      setDirty(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: '📋 Owner Dashboard',
      fields: [
        { key: 'owner_dashboard_title', label: 'Dashboard Title', default: 'Gabatee' },
        { key: 'owner_dashboard_message', label: 'Welcome Message', default: 'Baga nagaan dhuftan. Kunoo ilaalchi waligalaa iyyata maqaa daldalaa keessanii.' },
        { key: 'owner_recent_apps_title', label: 'Recent Apps Section Title', default: 'Iyyata Yeroo Dhihoo' },
        { key: 'owner_new_app_title', label: 'New Application Page Title', default: 'Iyyata Daldala Haaraa' },
        { key: 'owner_new_app_message', label: 'New Application Message', default: 'Maqaa daldala keessanii eeyyamamuuf tarkaanfiiwwan hunda xumuraa.' },
        { key: 'owner_applications_title', label: 'Applications List Title', default: 'Iyyata Hunda' },
        { key: 'owner_applications_message', label: 'Applications List Message', default: 'Iyyata maqaa daldalaa keessanii hunda asitti to\'adhaa.' },
        { key: 'owner_approval_msg_title', label: 'Approval Messages Title', default: 'Ergaa Ragga' },
        { key: 'owner_approval_msg_message', label: 'Approval Messages Message', default: 'Ergaawwan mirkaneessa ykn kufaa ta\'uu iyyata keessanii asitti dubbisaa.' },
      ],
    },
    {
      title: '🛡️ Admin Dashboard',
      fields: [
        { key: 'admin_dashboard_title', label: 'Dashboard Title', default: 'Admin Dashboard' },
        { key: 'admin_dashboard_message', label: 'Dashboard Message', default: 'System overview and management' },
      ],
    },
    {
      title: '🌍 Turizm (Language Review)',
      fields: [
        { key: 'turizm_dashboard_title', label: 'Dashboard Title', default: 'Addaf Turizm Biro Dashboard' },
        { key: 'turizm_dashboard_message', label: 'Dashboard Message', default: 'Review business descriptions for Afaan Oromo language compliance' },
        { key: 'turizm_approve_message', label: 'Approve Modal Message', default: 'You are about to approve the language compliance for this business description.' },
        { key: 'turizm_reject_message', label: 'Reject Modal Message', default: 'You are about to reject this application.' },
      ],
    },
    {
      title: '🏛️ Commercial Office',
      fields: [
        { key: 'commercial_dashboard_title', label: 'Dashboard Title', default: 'Commercial Office Dashboard' },
        { key: 'commercial_approve_message', label: 'Approve Modal Message', default: 'You are about to approve the commercial compliance for this business permit.' },
        { key: 'commercial_reject_message', label: 'Reject Modal Message', default: 'You are about to reject this application.' },
      ],
    },
    {
      title: '📡 Communication Office',
      fields: [
        { key: 'communication_dashboard_title', label: 'Dashboard Title', default: 'Communication Biro Dashboard' },
        { key: 'communication_accept_message', label: 'Accept Modal Message', default: 'You are about to accept this application. A message will be sent to the business owner explaining why it was accepted.' },
        { key: 'communication_reject_message', label: 'Reject Modal Message', default: 'You are about to reject this application. A message will be sent to the business owner explaining why it was rejected.' },
      ],
    },
  ];

  if (ctxLoading && !dirty) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Edit dynamic messages and titles for all dashboards.</p>
      </div>

      <form className="card" onSubmit={handleSave}>
        <div className={styles.grid}>
          {sections.map(section => (
            <div key={section.title} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {section.fields.map(field => (
                <div key={field.key} className={styles.fieldGroup}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={formData[field.key] ?? field.default}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="input"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={!dirty || loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
