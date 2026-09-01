import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { getApplicationById } from '@/services/applicationService';
import { formatDate, formatDateTime, formatFileSize } from '@/utils/formatters';
import { APPLICATION_STATUS } from '@/constants/statuses';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import Button from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import styles from './ApplicationDetailPage.module.css';

function buildTimeline(app) {
  if (!app) return [];
  const s = app.status;
  const steps = [
    { key: 'created',   label: 'Application Created',   date: app.createdAt,    status: 'completed' },
    { key: 'submitted', label: 'Application Submitted',  date: app.submittedAt,  status: app.submittedAt ? 'completed' : 'pending' },
    {
      key: 'permission',
      label: 'Commercial/Financial Review',
      date: app.permission?.reviewedAt,
      status: !app.permission ? 'pending'
        : app.permission.status === 'APPROVED' ? 'completed'
        : app.permission.status === 'REJECTED' ? 'error'
        : 'active',
      comment: app.permission?.reviewComment,
    },
    {
      key: 'language',
      label: 'Language Review',
      date: app.languageReview?.reviewedAt,
      status: !app.languageReview ? 'pending'
        : app.languageReview.status === 'APPROVED' ? 'completed'
        : app.languageReview.status === 'REJECTED' ? 'error'
        : 'active',
      comment: app.languageReview?.reviewComment,
    },
    {
      key: 'approved',
      label: 'Final Approval',
      date: s === APPLICATION_STATUS.APPROVED ? app.updatedAt : null,
      status: s === APPLICATION_STATUS.APPROVED || s === APPLICATION_STATUS.APPEAL_APPROVED ? 'completed' : 'pending',
    },
    {
      key: 'certificate',
      label: 'Certificate Issued',
      date: app.certificate?.issuedAt,
      status: app.certificate ? 'completed' : 'pending',
    },
  ];
  return steps;
}

export default function ApplicationDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { data: app, loading, error, refetch } = useAsync(
    () => getApplicationById(id), [id]
  );

  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;
  if (!app)    return null;

  const canAppeal = [
    APPLICATION_STATUS.PERMISSION_REJECTED,
    APPLICATION_STATUS.LANGUAGE_REJECTED,
  ].includes(app.status);

  const canCorrect = [
    APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED,
    APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED,
  ].includes(app.status);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/owner/applications')}>
            ← Back to Applications
          </button>
          <h1>{app.proposedBusinessName || app.businessName}</h1>
          <p>{app.applicationNumber}</p>
        </div>
        <div className={styles.headerRight}>
          <StatusBadge status={app.status} />
          {canAppeal && (
            <Button variant="warning" onClick={() => navigate('/owner/appeals')}>
              Appeal This Decision
            </Button>
          )}
          {canCorrect && (
            <Button variant="secondary" onClick={() => navigate('/owner/corrections')}>
              Respond to Correction
            </Button>
          )}
          {app.certificate && (
            <Button onClick={() => navigate('/owner/certificates')}>
              View Certificate
            </Button>
          )}
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Left: Details ─────────────────────────────────────── */}
        <div className={styles.mainCol}>
          {/* Application info */}
          <div className="card">
            <div className="card-header"><h3>Application Information</h3></div>
            <div className="card-body">
              <div className={styles.infoGrid}>
                <InfoField label="Application Number"   value={app.applicationNumber} />
                <InfoField label="Business Name"        value={app.proposedBusinessName || app.businessName} />
                <InfoField label="Category"             value={app.businessCategory?.name || 'Biroo (Other)'} />
                <InfoField label="Business Address"     value={app.businessAddress || app.address} />
                <InfoField label="Submission Date"      value={formatDate(app.submittedAt || app.createdAt)} />
                <InfoField label="Description"          value={app.businessDescription || app.description} span />
              </div>
            </div>
          </div>

          {/* Permission document */}
          {app.permissionDocument && (
            <div className="card" style={{ marginTop: 'var(--space-5)' }}>
              <div className="card-header"><h3>Business Permission Document</h3></div>
              <div className="card-body">
                <div className={styles.docCard}>
                  <span style={{ fontSize: 24 }}>📄</span>
                  <div>
                    <p style={{ fontWeight: 600 }}>{app.permissionDocument.name}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {formatFileSize(app.permissionDocument.size)}
                    </p>
                  </div>
                  <a
                    href={app.permissionDocument.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 'auto' }}
                  >
                    <Button size="sm" variant="secondary">View Document</Button>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Review summaries */}
          {app.permission && (
            <div className="card" style={{ marginTop: 'var(--space-5)' }}>
              <div className="card-header"><h3>Commercial/Financial Review</h3></div>
              <div className="card-body">
                <div className={styles.infoGrid}>
                  <InfoField label="Status"      value={<StatusBadge status={`PERMISSION_${app.permission.status}`} label={app.permission.status} />} />
                  <InfoField label="Reviewed By" value={app.permission.reviewer?.fullName || '—'} />
                  <InfoField label="Reviewed At" value={formatDateTime(app.permission.reviewedAt)} />
                  {app.permission.reviewComment && (
                    <InfoField label="Officer Comment" value={app.permission.reviewComment} span />
                  )}
                </div>
              </div>
            </div>
          )}

          {app.languageReview && (
            <div className="card" style={{ marginTop: 'var(--space-5)' }}>
              <div className="card-header"><h3>Language Review</h3></div>
              <div className="card-body">
                <div className={styles.infoGrid}>
                  <InfoField label="Status"      value={<StatusBadge status={`LANGUAGE_${app.languageReview.status}`} label={app.languageReview.status} />} />
                  <InfoField label="Reviewed By" value={app.languageReview.reviewer?.fullName || '—'} />
                  <InfoField label="Reviewed At" value={formatDateTime(app.languageReview.reviewedAt)} />
                  {app.languageReview.reviewComment && (
                    <InfoField label="Officer Comment" value={app.languageReview.reviewComment} span />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Timeline ─────────────────────────────────── */}
        <div className={styles.sideCol}>
          <div className="card">
            <div className="card-header"><h3>Application Timeline</h3></div>
            <div className="card-body">
              <Timeline steps={buildTimeline(app)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, span }) {
  return (
    <div style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </p>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
        {value ?? '—'}
      </div>
    </div>
  );
}
