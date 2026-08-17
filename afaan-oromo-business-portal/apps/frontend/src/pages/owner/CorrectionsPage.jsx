import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getMyCorrections, submitCorrection } from '@/services/applicationService';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './CorrectionsPage.module.css';

export default function CorrectionsPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const { data, loading, error, refetch } = useAsync(() => getMyCorrections(), []);
  const { mutate, loading: submitting } = useMutation(submitCorrection);

  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [respError, setRespError] = useState(null);

  const corrections = data ?? [];

  const handleOpen = (c) => { setSelected(c); setResponse(''); setRespError(null); };

  const handleSubmit = async () => {
    if (!response.trim()) { setRespError('Deebii ykn odeeffannoo haaromfame kennuu qaba.'); return; }
    try {
      await mutate(selected.applicationId, { response });
      toast.success('Sirreeffamni milkaahinaan dhiyaate.');
      setSelected(null);
      refetch();
    } catch (err) {
      setRespError(err?.message ?? 'Sirreeffama dhiyeessuun dadhabame.');
    }
  };

  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>Gaafii Sirreeffamaa</h1>
        <p>Gaafii sirreeffamaa qondaaltoota irraa dhufan gamaaggamaa fi deebisaa.</p>
      </div>

      {corrections.length === 0 ? (
        <EmptyState
          icon="✏️"
          title="Sirreeffamni tokkollee hin jiru"
          message="Gaafiin sirreeffamaa eegumsaa jala hin qabdan."
        />
      ) : (
        <div className={styles.list}>
          {corrections.map((c) => (
            <div key={c.id} className="card">
              <div className="card-body">
                <div className={styles.corrHeader}>
                  <div>
                    <h3>{c.businessName}</h3>
                    <p>{c.applicationNumber} · {c.type === 'FINANCIAL' ? 'Financial Review' : 'Language Review'}</p>
                  </div>
                  <div className={styles.corrActions}>
                    <span className="badge badge-orange">Sirreeffama Barbaachisa</span>
                    <Button size="sm" onClick={() => handleOpen(c)}>
                      Deebisi
                    </Button>
                  </div>
                </div>

                <div className={styles.reasonBox}>
                  <p className={styles.reasonLabel}>Sababa Qondaala Irraa</p>
                  <p className={styles.reasonText}>{c.reason}</p>
                </div>

                <div className={styles.corrMeta}>
                  <span>Requested by: <strong>{c.requestedBy}</strong></span>
                  <span>Date: <strong>{formatDate(c.requestedAt)}</strong></span>
                  <button
                    className={styles.viewApp}
                    onClick={() => navigate(`/owner/applications/${c.applicationId}`)}
                  >
                    View Application →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Respond to Correction Request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Submit Correction</Button>
          </>
        }
      >
        {selected && (
          <div className={styles.modalBody}>
            <div className={styles.reasonBox} style={{ marginBottom: 16 }}>
              <p className={styles.reasonLabel}>Officer's Reason</p>
              <p className={styles.reasonText}>{selected.reason}</p>
            </div>
            {respError && (
              <Alert variant="danger" onClose={() => setRespError(null)} style={{ marginBottom: 12 }}>
                {respError}
              </Alert>
            )}
            <Textarea
              label="Your Response / Updated Information"
              placeholder="Explain the correction or provide updated details…"
              value={response}
              onChange={(e) => { setResponse(e.target.value); setRespError(null); }}
              rows={5}
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
