import { useState } from 'react';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getMyAppeals, submitAppeal } from '@/services/appealService';
import { getMyApplications } from '@/services/applicationService';
import { APPLICATION_STATUS, APPEAL_STATUS_LABELS, APPEAL_STATUS_BADGE } from '@/constants/statuses';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { extractErrorMessage } from '@/utils/apiHelpers';
import styles from './AppealsPage.module.css';

const APPEALABLE = [APPLICATION_STATUS.PERMISSION_REJECTED, APPLICATION_STATUS.LANGUAGE_REJECTED];

export default function AppealsPage() {
  const toast = useToast();
  const { data: appeals, loading: appealsLoading, error: appealsError, refetch } = useAsync(() => getMyAppeals(), []);
  const { data: appsData } = useAsync(() => getMyApplications(), []);
  const { mutate, loading: submitting } = useMutation(submitAppeal);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]   = useState({ applicationId: '', reason: '' });
  const [formErr, setFormErr] = useState({});
  const [apiErr, setApiErr]   = useState(null);

  const appealableApps = (appsData ?? []).filter((a) => APPEALABLE.includes(a.status));

  const handleOpen  = () => { setForm({ applicationId: '', reason: '' }); setFormErr({}); setApiErr(null); setModalOpen(true); };
  const handleClose = () => setModalOpen(false);

  const validate = () => {
    const errs = {};
    if (!form.applicationId) errs.applicationId = 'Please select the application to appeal.';
    if (!form.reason.trim()) errs.reason = 'Appeal reason is required.';
    else if (form.reason.trim().length < 20) errs.reason = 'Please provide more detail (at least 20 characters).';
    setFormErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiErr(null);
    try {
      await mutate(form);
      toast.success('Appeal submitted successfully.');
      setModalOpen(false);
      refetch();
    } catch (err) {
      setApiErr(extractErrorMessage(err));
    }
  };

  if (appealsLoading) return <PageSpinner />;
  if (appealsError)   return <ErrorState message={appealsError} onRetry={refetch} />;

  const list = appeals ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My Appeals</h1>
          <p>Submit and track appeals for rejected applications.</p>
        </div>
        {appealableApps.length > 0 && (
          <Button onClick={handleOpen}>+ Submit Appeal</Button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="No appeals found"
          message={
            appealableApps.length > 0
              ? 'You have rejected applications that can be appealed.'
              : 'You have no rejected applications eligible for appeal.'
          }
          action={appealableApps.length > 0 ? handleOpen : undefined}
          actionLabel="Submit an Appeal"
        />
      ) : (
        <div className={styles.list}>
          {list.map((appeal) => (
            <div key={appeal.id} className="card">
              <div className="card-body">
                <div className={styles.appealHeader}>
                  <div>
                    <h3>{appeal.businessName}</h3>
                    <p>{appeal.applicationNumber}</p>
                  </div>
                  <span className={`badge badge-${APPEAL_STATUS_BADGE[appeal.status] ?? 'neutral'}`}>
                    {APPEAL_STATUS_LABELS[appeal.status] ?? appeal.status}
                  </span>
                </div>

                <div className={styles.appealGrid}>
                  <div>
                    <p className={styles.metaLabel}>Original Decision</p>
                    <StatusBadge status={appeal.originalDecision} />
                  </div>
                  <div>
                    <p className={styles.metaLabel}>Decision Date</p>
                    <p>{formatDate(appeal.originalDecisionDate)}</p>
                  </div>
                  <div>
                    <p className={styles.metaLabel}>Submitted</p>
                    <p>{formatDate(appeal.submittedAt)}</p>
                  </div>
                  {appeal.decidedAt && (
                    <div>
                      <p className={styles.metaLabel}>Decision Date</p>
                      <p>{formatDate(appeal.decidedAt)}</p>
                    </div>
                  )}
                </div>

                <div className={styles.reasonBox}>
                  <p className={styles.metaLabel}>Your Appeal Reason</p>
                  <p>{appeal.appealReason}</p>
                </div>

                {appeal.decisionComment && (
                  <div className={`${styles.reasonBox} ${styles.decisionBox}`}>
                    <p className={styles.metaLabel}>Senior Officer Decision</p>
                    <p>{appeal.decisionComment}</p>
                    {appeal.decisionBy && (
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        — {appeal.decisionBy}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit appeal modal */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        title="Submit an Appeal"
        footer={
          <>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Submit Appeal</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {apiErr && <Alert variant="danger" onClose={() => setApiErr(null)}>{apiErr}</Alert>}

          <Select
            label="Application to Appeal"
            required
            options={appealableApps.map((a) => ({
              value: a.id,
              label: `${a.applicationNumber} — ${a.businessName}`,
            }))}
            value={form.applicationId}
            onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
            error={formErr.applicationId}
            placeholder="Select application…"
          />

          <Textarea
            label="Reason for Appeal"
            required
            rows={5}
            placeholder="Clearly explain why you are appealing this decision and provide supporting arguments…"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            error={formErr.reason}
          />
        </div>
      </Modal>
    </div>
  );
}
