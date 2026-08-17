import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getMyCertificates, downloadCertificate } from '@/services/certificateService';
import { formatDate } from '@/utils/formatters';
import { CERTIFICATE_STATUS_LABELS, CERTIFICATE_STATUS_BADGE } from '@/constants/statuses';
import Button from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './CertificatesPage.module.css';

export default function CertificatesPage() {
  const toast = useToast();
  const { data, loading, error, refetch } = useAsync(() => getMyCertificates(), []);
  const certs = data ?? [];

  const handleDownload = async (id) => {
    try {
      await downloadCertificate(id);
      toast.success('Certificate download started.');
    } catch {
      toast.error('Failed to download certificate.');
    }
  };

  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>My Certificates</h1>
        <p>Download and view your approved business name certificates.</p>
      </div>

      {certs.length === 0 ? (
        <EmptyState
          icon="🏅"
          title="No certificates yet"
          message="Once your business name application is approved, your certificate will appear here."
        />
      ) : (
        <div className={styles.grid}>
          {certs.map((cert) => (
            <div key={cert.id} className={`card ${styles.certCard}`}>
              {/* Certificate preview header */}
              <div className={styles.certPreview}>
                <div className={styles.previewLogo}>🌿</div>
                <div className={styles.previewSeal}>
                  <p className={styles.previewGov}>GOVERNMENT OF OROMIA</p>
                  <p className={styles.previewTitle}>Business Name Certificate</p>
                  <p className={styles.previewPortal}>Afaan Oromo Business Name Approval Portal</p>
                </div>
              </div>

              <div className="card-body">
                <div className={styles.certDetails}>
                  <div className={styles.certName}>{cert.businessName}</div>

                  <div className={styles.certGrid}>
                    <CertField label="Approval Number" value={cert.approvalNumber} />
                    <CertField label="Category"        value={cert.category} />
                    <CertField label="Approval Date"   value={formatDate(cert.approvalDate)} />
                    <CertField label="Issuing Office"  value={cert.issuingOffice} />
                  </div>

                  <div className={styles.statusRow}>
                    <span className={`badge badge-${CERTIFICATE_STATUS_BADGE[cert.status]}`}>
                      {CERTIFICATE_STATUS_LABELS[cert.status]}
                    </span>
                  </div>
                </div>

                <div className={styles.certActions}>
                  {cert.qrCode && (
                    <img
                      src={cert.qrCode}
                      alt={`QR code for ${cert.approvalNumber}`}
                      className={styles.qrCode}
                    />
                  )}
                  <Button
                    onClick={() => handleDownload(cert.id)}
                    size="sm"
                    fullWidth
                  >
                    ⬇ Download Certificate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CertField({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>
        {value ?? '—'}
      </p>
    </div>
  );
}
