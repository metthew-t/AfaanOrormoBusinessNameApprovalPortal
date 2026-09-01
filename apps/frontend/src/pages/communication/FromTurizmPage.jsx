import { useAsync } from '@/hooks/useAsync';
import { getMessagesFromDepartment } from '@/services/communicationService';
import { formatDate } from '@/utils/formatters';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './FromTurizmPage.module.css';

export default function FromTurizmPage() {
  const { data, loading, error, refetch } = useAsync(() => getMessagesFromDepartment('turizm'), []);

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const applications = data ?? [];

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>📨 Messages from Waajira Aadaaf Turizimii</h1>
        <p>Review language assessment results from Waajira Aadaaf Turizimii</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No messages yet"
          message="Language assessment results from Waajira Aadaaf Turizimii will appear here"
        />
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((app) => (
            <div key={app.id} className={`card ${styles.appCard}`}>
              <div className="card-body">
                {/* Header */}
                <div className={styles.appHeader}>
                  <div>
                    <h3 className={styles.businessName}>{app.businessName}</h3>
                    <p className={styles.appNumber}>{app.applicationNumber}</p>
                  </div>
                  <div className={styles.statusBadge} data-status={app.turizmStatus}>
                    {app.turizmStatus === 'APPROVED' && '✅ Language Approved'}
                    {app.turizmStatus === 'REJECTED' && '❌ Language Rejected'}
                    {app.turizmStatus === 'CORRECTION_REQUESTED' && '⚠️ Corrections Needed'}
                  </div>
                </div>

                {/* Details */}
                <div className={styles.appDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Category:</span>
                    <span className={styles.value}>{app.category?.name || app.category}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Submitted:</span>
                    <span className={styles.value}>{formatDate(app.submittedAt)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Reviewed:</span>
                    <span className={styles.value}>{formatDate(app.turizmReviewedAt)}</span>
                  </div>
                </div>

                {/* Description */}
                <div className={styles.descriptionBox}>
                  <div className={styles.descriptionLabel}>Business Description:</div>
                  <div className={styles.descriptionText}>{app.description}</div>
                </div>

                {/* Turizm Review */}
                <div className={styles.reviewBox} data-status={app.turizmStatus}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewIcon}>
                      {app.turizmStatus === 'APPROVED' ? '✅' : '❌'}
                    </span>
                    <h4>Language Assessment Result</h4>
                  </div>
                  <p className={styles.reviewComment}>{app.turizmComment}</p>
                </div>

                {/* Action Buttons - REMOVED: Now read-only */}
                {app.finalDecision && (
                  <div className={styles.finalDecisionBox}>
                    <strong>Final Decision:</strong> {app.finalDecision}
                    <p>{app.finalDecisionReason}</p>
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
