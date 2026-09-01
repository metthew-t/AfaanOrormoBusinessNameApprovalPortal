import { useAsync } from '@/hooks/useAsync';
import { useSettings } from '@/context/SettingsContext';
import { getMyApplications } from '@/services/applicationService';
import { formatDate } from '@/utils/formatters';
import { APPLICATION_STATUS } from '@/constants/statuses';
import StatusBadge from '@/components/ui/StatusBadge';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './ApprovalMessagesPage.module.css';

export default function ApprovalMessagesPage() {
  const { getSetting } = useSettings();
  const { data, loading, error, refetch } = useAsync(() => getMyApplications(), []);
  
  // Filter applications that have approval/rejection messages
  const apps = data?.applications || (Array.isArray(data) ? data : []);
  const messagesWithStatus = apps.filter((app) => 
    app.status !== APPLICATION_STATUS.DRAFT && 
    app.status !== APPLICATION_STATUS.SUBMITTED &&
    // Exclude rejected statuses - they should appear in Corrections page only
    app.status !== APPLICATION_STATUS.PERMISSION_REJECTED &&
    app.status !== APPLICATION_STATUS.LANGUAGE_REJECTED &&
    app.status !== APPLICATION_STATUS.REJECTED // Final rejection by Communication Officer
  );

  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>{getSetting('owner_approval_msg_title', 'Ergaa Ragga')}</h1>
        <p>{getSetting('owner_approval_msg_message', 'Haala raggaa fi ergaa Biiroo Qunnamtii irraa iyyata keessaniif ilaalaa.')}</p>
      </div>

      {messagesWithStatus.length === 0 ? (
        <EmptyState
          icon="📬"
          title="Ergaan tokkollee hin jiru"
          message="Iyyanni keessan erga Biiroo Qunnamtiitiin gamaaggamee booda, ergaan raggaa asitti ni mul'ata."
        />
      ) : (
        <div className={styles.messagesList}>
          {messagesWithStatus.map((app) => (
            <div key={app.id} className={`card ${styles.messageCard}`}>
              <div className="card-body">
                {/* Message Header */}
                <div className={styles.messageHeader}>
                  <div className={styles.messageIcon}>
                    {getStatusIcon(app.status)}
                  </div>
                  <div className={styles.messageInfo}>
                    <h3 className={styles.businessName}>{app.businessName}</h3>
                    <p className={styles.applicationNumber}>{app.applicationNumber}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Message Details */}
                <div className={styles.messageDetails}>
                  <div className={styles.detailGrid}>
                    <MessageField label="Gosa" value={typeof app.businessCategory === 'string' ? app.businessCategory : app.businessCategory?.name || '—'} />
                    <MessageField label="Dhiyaate" value={formatDate(app.submittedAt)} />
                    <MessageField label="Yeroo Dhumaa Haaromfame" value={formatDate(app.updatedAt)} />
                  </div>
                </div>

                {/* Approval/Rejection Message */}
                {getMessageContent(app)}

                {/* Progress Timeline */}
                {app.timeline && app.timeline.length > 0 && (
                  <div className={styles.timeline}>
                    <p className={styles.timelineTitle}>Adeemsa Iyyata</p>
                    {app.timeline.map((event, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                          <p className={styles.timelineEvent}>{event.event}</p>
                          <p className={styles.timelineDate}>{formatDate(event.timestamp)}</p>
                          {event.comment && (
                            <p className={styles.timelineComment}>{event.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageField({ label, value }) {
  return (
    <div>
      <p className={styles.fieldLabel}>{label}</p>
      <p className={styles.fieldValue}>{value ?? '—'}</p>
    </div>
  );
}

function getStatusIcon(status) {
  if (status === APPLICATION_STATUS.APPROVED) return '✅';
  if (status.includes('REJECTED')) return '❌';
  if (status.includes('PENDING')) return '⏳';
  if (status.includes('CORRECTION')) return '📝';
  if (status.includes('APPROVED')) return '✅';
  return '📄';
}

function getMessageContent(app) {
  const { status, reviewComments, correctionNotes } = app;

  // Approved
  if (status === APPLICATION_STATUS.APPROVED) {
    return (
      <div className={`${styles.messageBox} ${styles.messageSuccess}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>🎉</span>
          <h4>Application Approved!</h4>
        </div>
        <p>Congratulations! Your business name application has been approved by all reviewing departments.</p>
        <div className={styles.messageAction}>
          <p className={styles.nextSteps}>
            <strong>Waajira Kominikeeshinii:</strong> {app.finalDecisionReason || 'Your application has been approved.'}
          </p>
        </div>
      </div>
    );
  }

  // Permission Approved (moved to language review)
  if (status === APPLICATION_STATUS.PERMISSION_APPROVED) {
    return (
      <div className={`${styles.messageBox} ${styles.messageInfo}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>✓</span>
          <h4>Commercial Review Approved</h4>
        </div>
        <p>Your business permits have been reviewed and approved by Waajira Daldaala.</p>
        <p className={styles.messageComment}>{reviewComments || 'Your documentation meets all commercial requirements.'}</p>
        <p className={styles.nextSteps}>
          <strong>Status:</strong> Your application is now being reviewed by Waajira Aadaaf Turizimii for language compliance.
        </p>
      </div>
    );
  }

  // Language Review Pending
  if (status === APPLICATION_STATUS.LANGUAGE_REVIEW_PENDING) {
    return (
      <div className={`${styles.messageBox} ${styles.messageInfo}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>🔍</span>
          <h4>Under Review - Waajira Aadaaf Turizimii</h4>
        </div>
        <p>Your business description is currently being reviewed for Afaan Oromo language compliance.</p>
        <p className={styles.nextSteps}>
          <strong>Expected Timeline:</strong> Reviews typically complete within 3-5 business days.
        </p>
      </div>
    );
  }

  // Correction Required
  if (status === APPLICATION_STATUS.PERMISSION_CORRECTION_REQUIRED || 
      status === APPLICATION_STATUS.LANGUAGE_CORRECTION_REQUIRED) {
    return (
      <div className={`${styles.messageBox} ${styles.messageWarning}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>📝</span>
          <h4>Correction Required</h4>
        </div>
        <p>The reviewing office has requested corrections to your application.</p>
        {correctionNotes && (
          <div className={styles.correctionBox}>
            <p className={styles.correctionLabel}>Required Corrections:</p>
            <p className={styles.correctionText}>{correctionNotes}</p>
          </div>
        )}
        <p className={styles.nextSteps}>
          <strong>Action Required:</strong> Please review the feedback and submit corrected information.
        </p>
      </div>
    );
  }

  // Rejected
  if (status.includes('REJECTED')) {
    const isPermissionRejected = status === APPLICATION_STATUS.PERMISSION_REJECTED;
    const department = isPermissionRejected ? 'Waajira Daldaala' : 'Waajira Aadaaf Turizimii';
    
    return (
      <div className={`${styles.messageBox} ${styles.messageDanger}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>❌</span>
          <h4>Application Rejected</h4>
        </div>
        <p>Your application has been rejected by the {department}.</p>
        {reviewComments && (
          <div className={styles.correctionBox}>
            <p className={styles.correctionLabel}>Rejection Reason:</p>
            <p className={styles.correctionText}>{reviewComments}</p>
          </div>
        )}
        <p className={styles.nextSteps}>
          <strong>Next Steps:</strong> You may submit a new application with the necessary corrections.
        </p>
      </div>
    );
  }

  // Pending (Permission or Language)
  if (status === APPLICATION_STATUS.PERMISSION_PENDING) {
    return (
      <div className={`${styles.messageBox} ${styles.messageInfo}`}>
        <div className={styles.messageBoxHeader}>
          <span className={styles.messageBoxIcon}>⏳</span>
          <h4>Pending Review - Waajira Daldaala</h4>
        </div>
        <p>Your application and business permits are being reviewed by Waajira Daldaala.</p>
        <p className={styles.nextSteps}>
          <strong>Expected Timeline:</strong> Reviews typically complete within 2-4 business days.
        </p>
      </div>
    );
  }

  // Default
  return (
    <div className={`${styles.messageBox} ${styles.messageInfo}`}>
      <div className={styles.messageBoxHeader}>
        <span className={styles.messageBoxIcon}>📋</span>
        <h4>Application In Progress</h4>
      </div>
      <p>Your application is being processed through the review workflow.</p>
      <p className={styles.nextSteps}>
        <strong>Status:</strong> Waajira Kominikeeshinii is coordinating your application review.
      </p>
    </div>
  );
}
