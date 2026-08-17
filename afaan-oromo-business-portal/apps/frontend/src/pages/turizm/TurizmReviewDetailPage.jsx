import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getApplicationForReview, approveDescription, rejectDescription } from '@/services/turizmService';
import { formatDate } from '@/utils/formatters';
import { extractErrorMessage } from '@/utils/apiHelpers';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import Modal from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import styles from './TurizmReviewDetailPage.module.css';

export default function TurizmReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { data: app, loading, error, refetch } = useAsync(() => getApplicationForReview(id), [id]);
  const { mutate: approve, loading: approving } = useMutation(approveDescription);
  const { mutate: reject, loading: rejecting } = useMutation(rejectDescription);

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
        toast.success('Application approved successfully');
      } else if (action === 'reject') {
        await reject({ applicationId: id, reason: reason });
        toast.success('Application rejected');
      }
      navigate('/turizm/reviews');
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!app) return <ErrorState message="Application not found" />;

  const isProcessed = app.turizmStatus && app.turizmStatus !== 'PENDING';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/turizm/reviews')}>
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
          {/* Business Description Card */}
          <div className="card">
            <div className="card-header">
              <h2>Business Description - Language Review</h2>
            </div>
            <div className="card-body">
              <div className={styles.descriptionBox}>
                <p className={styles.descriptionLabel}>Business Description in Afaan Oromo:</p>
                <div className={styles.descriptionContent}>
                  {app.description}
                </div>
              </div>

              <div className={styles.reviewChecklist}>
                <p className={styles.checklistTitle}>Review Criteria:</p>
                <div className={styles.checklistGrid}>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>📝</span>
                    <div>
                      <h4>Spelling & Grammar</h4>
                      <p>Verify correct Afaan Oromo spelling and grammatical structure</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>🔤</span>
                    <div>
                      <h4>Language Purity</h4>
                      <p>Ensure proper use of Afaan Oromo terms without unnecessary foreign words</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>💭</span>
                    <div>
                      <h4>Meaning & Clarity</h4>
                      <p>Confirm the description clearly conveys the business purpose</p>
                    </div>
                  </div>
                  <div className={styles.checklistItem}>
                    <span className={styles.checklistIcon}>🌍</span>
                    <div>
                      <h4>Cultural Appropriateness</h4>
                      <p>Ensure terminology respects Oromo cultural values and norms</p>
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
                    ✓ Approve Description
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
              <DetailField label="Owner" value={app.owner?.fullName} />
              <DetailField label="Owner Email" value={app.owner?.email} />
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
          action === 'approve' ? 'Approve Description' :
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
                <p>You are about to <strong>approve</strong> the language compliance for this business description.</p>
                <p>Please provide detailed feedback on why this description meets Afaan Oromo standards:</p>
              </>
            )}
            {action === 'reject' && (
              <>
                <p>You are about to <strong>reject</strong> this application.</p>
                <p>Please provide a detailed explanation of why the description does not meet language compliance standards:</p>
              </>
            )}
          </div>

          <Textarea
            label={
              action === 'approve' ? 'Approval Comment' :
              'Rejection Reason'
            }
            placeholder={
              action === 'approve' ? 'Explain why this description meets Afaan Oromo language standards...' :
              'Explain specifically why this description is rejected...'
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
