import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getApplicationForReview, approvePermit, rejectPermit } from '@/services/commercialService';
import { formatDate } from '@/utils/formatters';
import { extractErrorMessage } from '@/utils/apiHelpers';
import { useSettings } from '@/context/SettingsContext';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import Modal from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import styles from './CommercialReviewDetailPage.module.css';

export default function CommercialReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { data: app, loading, error, refetch } = useAsync(() => getApplicationForReview(id), [id]);
  const { mutate: approve, loading: approving } = useMutation(approvePermit);
  const { mutate: reject, loading: rejecting } = useMutation(rejectPermit);
  const { getSetting } = useSettings();

  const [action, setAction] = useState(null); // 'approve', 'reject'
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleActionClick = (actionType) => {
    setAction(actionType);
    setReason('');
    setReasonError('');
    setApiError(null);
    setConfirmOpen(true);
  };

  const validateReason = () => {
    if (!reason.trim()) {
      setReasonError('Please provide a detailed reason for your decision');
      return false;
    }
    if (reason.trim().length < 20) {
      setReasonError('Please provide more detail (at least 20 characters)');
      return false;
    }
    setReasonError('');
    return true;
  };

  const handleConfirm = async () => {
    if (!validateReason()) return;

    setApiError(null);
    try {
      if (action === 'approve') {
        await approve({ applicationId: id, comment: reason });
        toast.success('Business permit approved successfully');
      } else if (action === 'reject') {
        await reject({ applicationId: id, reason: reason });
        toast.success('Application rejected');
      }
      navigate('/commercial/reviews');
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!app) return <ErrorState message="Application not found" />;

  const isProcessed = app.commercialStatus && app.commercialStatus !== 'PENDING';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/commercial/reviews')}>
            ← Back to Queue
          </Button>
          <h1>{app.businessName}</h1>
          <p className={styles.appNumber}>{app.applicationNumber}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className={styles.content}>
        {/* Main Review Section */}
        <div className={styles.mainColumn}>
          {/* Business Permission Document Card */}
          <div className="card">
            <div className="card-header">
              <h2>Business Permission Certificate Review</h2>
            </div>
            <div className="card-body">
              <div className={styles.documentBox}>
                <div className={styles.documentIcon}>📄</div>
                <div className={styles.documentInfo}>
                  <h3>{app.permissionDocument?.fileName ?? 'Business Permission Certificate'}</h3>
                  <p className={styles.documentMeta}>
                    Uploaded: {formatDate(app.permissionDocument?.uploadedAt ?? app.submittedAt)}
                  </p>
                  <p className={styles.documentSize}>
                    {app.permissionDocument?.fileSize ? `${(app.permissionDocument.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Document attached'}
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.open(app.permissionDocument?.url, '_blank')}
                >
                  📥 View Document
                </Button>
              </div>

              <div className={styles.reviewChecklist}>
                <p className={styles.checklistTitle}>Commercial Compliance Checklist:</p>
                <div className={styles.checklistGrid}>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>✓</span>
                    <div>
                      <h4>Document Authenticity</h4>
                      <p>Verify the certificate is issued by an authorized authority</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>📅</span>
                    <div>
                      <h4>Validity & Expiration</h4>
                      <p>Ensure the permit is current and not expired</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>🏢</span>
                    <div>
                      <h4>Business Activity Match</h4>
                      <p>Confirm permitted activities align with proposed business</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>📋</span>
                    <div>
                      <h4>Required Information</h4>
                      <p>All mandatory fields and stamps are present and legible</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>⚖️</span>
                    <div>
                      <h4>Regulatory Compliance</h4>
                      <p>Business type meets commercial regulations</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>🔍</span>
                    <div>
                      <h4>No Discrepancies</h4>
                      <p>Information matches application details</p>
                    </div>
                  </div>
                </div>
              </div>

              {!isProcessed && (
                <div className={styles.actions}>
                  <Button 
                    variant="success" 
                    onClick={() => handleActionClick('approve')}
                    disabled={approving || rejecting}
                  >
                    ✓ Approve Permit
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleActionClick('reject')}
                    disabled={approving || rejecting}
                  >
                    ✕ Reject Application
                  </Button>
                </div>
              )}

              {isProcessed && (
                <Alert variant="info">
                  This application has already been reviewed.
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Application Details */}
          <div className="card">
            <div className="card-header">
              <h3>Application Details</h3>
            </div>
            <div className="card-body">
              <DetailField label="Business Name" value={app.businessName} />
              <DetailField label="Category" value={app.category} />
              <DetailField label="Description" value={app.description} />
              <DetailField label="Owner" value={app.owner?.fullName} />
              <DetailField label="Owner Email" value={app.owner?.email} />
              <DetailField label="Owner Phone" value={app.owner?.phone} />
              <DetailField label="Business Address" value={app.address} />
              <DetailField label="Received" value={formatDate(app.receivedAt)} />
            </div>
          </div>

          {/* Timeline */}
          {app.timeline && app.timeline.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3>Application History</h3>
              </div>
              <div className="card-body">
                <Timeline events={app.timeline} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={
          action === 'approve' ? 'Approve Business Permit' :
          'Reject Application'
        }
        size="md"
      >
        <div className={styles.confirmContent}>
          {apiError && (
            <Alert variant="danger" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <div className={styles.confirmMessage}>
            {action === 'approve' && (
              <>
                <p>{getSetting('commercial_approve_message', 'You are about to approve the commercial compliance for this business permit.')}</p>
                <p>Please provide detailed feedback on why this permit meets commercial requirements:</p>
              </>
            )}
            {action === 'reject' && (
              <>
                <p>{getSetting('commercial_reject_message', 'You are about to reject this application.')}</p>
                <p>Please provide a detailed explanation of why the commercial permit is rejected:</p>
              </>
            )}
          </div>

          <Textarea
            label={
              action === 'approve' ? 'Approval Comment' :
              'Rejection Reason'
            }
            placeholder={
              action === 'approve' ? 'Explain why this permit meets commercial requirements...' :
              'Explain specifically why this permit is rejected...'
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={reasonError}
            rows={6}
            required
          />

          <Alert variant="info">
            Your detailed feedback helps ensure quality and provides clear guidance to applicants.
          </Alert>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={approving || rejecting}>
              Cancel
            </Button>
            <Button 
              variant={action === 'approve' ? 'success' : 'danger'} 
              onClick={handleConfirm} 
              loading={approving || rejecting}
              disabled={!reason.trim() || reason.trim().length < 20}
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className={styles.detailField}>
      <p className={styles.detailLabel}>{label}</p>
      <p className={styles.detailValue}>{value ?? '—'}</p>
    </div>
  );
}
