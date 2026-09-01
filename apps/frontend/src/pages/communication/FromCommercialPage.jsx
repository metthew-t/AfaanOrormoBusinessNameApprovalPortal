import { useAsync } from '@/hooks/useAsync';
import { getMessagesFromDepartment } from '@/services/communicationService';
import { formatDate } from '@/utils/formatters';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './FromCommercialPage.module.css';

export default function FromCommercialPage() {
  const { data, loading, error, refetch } = useAsync(() => getMessagesFromDepartment('commercial'), []);

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const applications = data ?? [];

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>📨 Messages from Waajira Daldaala</h1>
        <p>Review permit assessment results and make final decisions</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No messages yet"
          message="Permit assessment results from Waajira Daldaala will appear here"
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
                  <div className={styles.statusBadge} data-status={app.commercialStatus}>
                    {app.commercialStatus === 'APPROVED' && '✅ Permit Approved'}
                    {app.commercialStatus === 'REJECTED' && '❌ Permit Rejected'}
                    {app.commercialStatus === 'CORRECTION_REQUESTED' && '⚠️ Corrections Needed'}
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
                    <span className={styles.value}>{formatDate(app.commercialReviewedAt)}</span>
                  </div>
                </div>

                {/* Permit Documents */}
                {app.permitDocuments && app.permitDocuments.length > 0 && (
                  <div className={styles.documentsBox}>
                    <div className={styles.documentsLabel}>Submitted Permit Documents:</div>
                    <div className={styles.documentsList}>
                      {app.permitDocuments.map((doc, idx) => (
                        <div key={idx} className={styles.documentItem}>
                          <span className={styles.docIcon}>📄</span>
                          <span className={styles.docName}>{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commercial Review */}
                <div className={styles.reviewBox} data-status={app.commercialStatus}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewIcon}>
                      {app.commercialStatus === 'APPROVED' ? '✅' : '❌'}
                    </span>
                    <h4>Permit Assessment Result</h4>
                  </div>
                  <p className={styles.reviewComment}>{app.commercialComment}</p>
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
