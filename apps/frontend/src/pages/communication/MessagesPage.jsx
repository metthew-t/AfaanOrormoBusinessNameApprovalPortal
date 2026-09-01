import { useState } from 'react';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getMessages, sendMessage, markMessageAsRead, getReviewedApplications, makeFinalDecision } from '@/services/communicationService';
import { formatDate } from '@/utils/formatters';
import { extractErrorMessage } from '@/utils/apiHelpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import styles from './MessagesPage.module.css';

const DEPARTMENTS = [
  { value: 'COMMERCIAL', label: 'Waajira Daldaala' },
  { value: 'TURIZM', label: 'Waajira Aadaaf Turizimii' },
  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
];

export default function MessagesPage() {
  const toast = useToast();
  const { data: messages, loading, error, refetch } = useAsync(() => getMessages(), []);
  const { data: reviewedApps, loading: reviewedLoading, error: reviewedError, refetch: refetchReviewed } = useAsync(() => getReviewedApplications(), []);
  const { mutate: send, loading: sending } = useMutation(sendMessage);
  const { mutate: markRead } = useMutation(markMessageAsRead);
  const { mutate: finalizeDecision, loading: finalizing } = useMutation(makeFinalDecision);

  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'reviewed'
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [decisionForm, setDecisionForm] = useState({ decision: '', reason: '' });
  
  const [form, setForm] = useState({
    recipient: '',
    subject: '',
    body: '',
    applicationNumber: '',
  });
  const [formError, setFormError] = useState({});
  const [apiError, setApiError] = useState(null);

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    
    if (!message.isRead) {
      await markRead(message.id);
      refetch();
    }
  };

  const handleCompose = () => {
    setForm({ recipient: '', subject: '', body: '', applicationNumber: '' });
    setFormError({});
    setApiError(null);
    setComposeOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.recipient) errors.recipient = 'Recipient is required';
    if (!form.subject.trim()) errors.subject = 'Subject is required';
    if (!form.body.trim()) errors.body = 'Message body is required';
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    
    setApiError(null);
    try {
      await send(form);
      toast.success('Message sent successfully');
      setComposeOpen(false);
      refetch();
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  const handleViewReviewedApp = (app) => {
    setSelectedApp(app);
    setDecisionForm({ decision: '', reason: '' });
    setReviewModalOpen(true);
  };

  const handleFinalDecision = async (decision) => {
    if (!decisionForm.reason.trim()) {
      toast.error('Please provide a reason for your decision');
      return;
    }

    try {
      await finalizeDecision(selectedApp.id, {
        decision,
        reason: decisionForm.reason,
      });
      toast.success(`Application ${decision === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
      setReviewModalOpen(false);
      refetchReviewed();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading && reviewedLoading) return <PageSpinner />;
  if (error && !messages) return <ErrorState message={error} onRetry={refetch} />;

  const messagesList = messages ?? [];
  const reviewedAppsList = reviewedApps ?? [];
  const unreadCount = messagesList.filter(m => !m.isRead).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>📨 Messages from Waajira Daldaala and Waajira Aadaaf Turizimii</h1>
          <p>Review permit assessment results and make final decisions</p>
        </div>
        <Button onClick={handleCompose}>+ New Message</Button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'messages' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reviewed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviewed')}
        >
          ✅ Reviewed Applications {reviewedAppsList.length > 0 && <span className={styles.badge}>{reviewedAppsList.length}</span>}
        </button>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <>
          {messagesList.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No messages"
              message="You don't have any messages yet. Communications from departments will appear here."
              action={handleCompose}
              actionLabel="Send a Message"
            />
          ) : (
            <div className={styles.messagesList}>
              {messagesList.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageItem} ${!message.isRead ? styles.unread : ''}`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className={styles.messageIcon}>
                    {message.isRead ? '📧' : '📬'}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <div>
                        <h3 className={styles.messageSubject}>{message.subject}</h3>
                        <p className={styles.messageSender}>
                          From: <strong>{message.senderName}</strong> ({message.senderDepartment})
                        </p>
                      </div>
                      <span className={styles.messageDate}>{formatDate(message.createdAt)}</span>
                    </div>
                    {message.applicationNumber && (
                      <p className={styles.messageAppRef}>
                        Re: Application {message.applicationNumber}
                      </p>
                    )}
                    <p className={styles.messagePreview}>
                      {message.body.substring(0, 150)}
                      {message.body.length > 150 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reviewed Applications Tab */}
      {activeTab === 'reviewed' && (
        <>
          {reviewedLoading ? (
            <PageSpinner />
          ) : reviewedError ? (
            <ErrorState message={reviewedError} onRetry={refetchReviewed} />
          ) : reviewedAppsList.length === 0 ? (
            <EmptyState
              icon="⏳"
              title="No reviewed applications"
              message="Applications with completed reviews from both departments will appear here for your final decision."
            />
          ) : (
            <div className={styles.reviewedList}>
              {reviewedAppsList.map((app) => (
                <div
                  key={app.id}
                  className={styles.reviewedCard}
                  onClick={() => handleViewReviewedApp(app)}
                >
                  <div className={styles.reviewedHeader}>
                    <div>
                      <h3>{app.businessName}</h3>
                      <p className={styles.reviewedAppNumber}>{app.applicationNumber}</p>
                    </div>
                    <Button size="sm" variant="primary">Review & Decide</Button>
                  </div>

                  <div className={styles.reviewsGrid}>
                    <div className={styles.reviewBox}>
                      <h4>🏢 Waajira Daldaala</h4>
                      <p className={`${styles.reviewStatus} ${styles[app.commercialReview?.status.toLowerCase()]}`}>
                        {app.commercialReview?.status || 'PENDING'}
                      </p>
                      {app.commercialReview?.comment && (
                        <p className={styles.reviewComment}>{app.commercialReview.comment.substring(0, 100)}...</p>
                      )}
                    </div>

                    <div className={styles.reviewBox}>
                      <h4>🌍 Waajira Aadaaf Turizimii</h4>
                      <p className={`${styles.reviewStatus} ${styles[app.languageReview?.status.toLowerCase()]}`}>
                        {app.languageReview?.status || 'PENDING'}
                      </p>
                      {app.languageReview?.comment && (
                        <p className={styles.reviewComment}>{app.languageReview.comment.substring(0, 100)}...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Compose Modal */}
      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="New Message"
        size="large"
        footer={
          <>
            <Button variant="secondary" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} loading={sending}>
              Send Message
            </Button>
          </>
        }
      >
        <div className={styles.composeForm}>
          {apiError && (
            <Alert variant="danger" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <Select
            label="Recipient"
            options={DEPARTMENTS}
            value={form.recipient}
            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            error={formError.recipient}
            placeholder="Select department..."
            required
          />

          <Input
            label="Application Number (Optional)"
            placeholder="e.g., APP-2024-001234"
            value={form.applicationNumber}
            onChange={(e) => setForm({ ...form, applicationNumber: e.target.value })}
            hint="Reference an application if this message is related to a specific case"
          />

          <Input
            label="Subject"
            placeholder="Message subject..."
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            error={formError.subject}
            required
          />

          <Textarea
            label="Message"
            rows={8}
            placeholder="Type your message here..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            error={formError.body}
            required
          />
        </div>
      </Modal>

      {/* View Message Modal */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Message"
        size="large"
        footer={
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        }
      >
        {selectedMessage && (
          <div className={styles.messageView}>
            <div className={styles.viewHeader}>
              <div className={styles.viewMeta}>
                <p className={styles.viewFrom}>
                  <strong>From:</strong> {selectedMessage.senderName} ({selectedMessage.senderDepartment})
                </p>
                <p className={styles.viewDate}>
                  <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                </p>
                {selectedMessage.applicationNumber && (
                  <p className={styles.viewAppRef}>
                    <strong>Re:</strong> Application {selectedMessage.applicationNumber}
                  </p>
                )}
              </div>
              <h2 className={styles.viewSubject}>{selectedMessage.subject}</h2>
            </div>
            <div className={styles.viewBody}>
              <p>{selectedMessage.body}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Review & Final Decision Modal */}
      <Modal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Make Final Decision"
        size="large"
      >
        {selectedApp && (
          <div className={styles.finalDecisionView}>
            <div className={styles.appInfo}>
              <h2>{selectedApp.businessName}</h2>
              <p><strong>Application Number:</strong> {selectedApp.applicationNumber}</p>
              <p><strong>Owner:</strong> {selectedApp.owner.fullName} ({selectedApp.owner.email})</p>
              <p><strong>Category:</strong> {selectedApp.category}</p>
              <p><strong>Description:</strong> {selectedApp.description}</p>
              <p><strong>Submitted:</strong> {formatDate(selectedApp.submittedAt)}</p>
            </div>

            <div className={styles.reviewsDetail}>
              <h3>Department Reviews</h3>
              
              <div className={styles.reviewDetailBox}>
                <h4>🏢 Waajira Daldaala (Commercial Office)</h4>
                <p><strong>Decision:</strong> <span className={`${styles.reviewBadge} ${styles[selectedApp.commercialReview?.status.toLowerCase()]}`}>{selectedApp.commercialReview?.status}</span></p>
                <p><strong>Reviewed by:</strong> {selectedApp.commercialReview?.reviewedBy}</p>
                <p><strong>Date:</strong> {formatDate(selectedApp.commercialReview?.reviewedAt)}</p>
                <div className={styles.commentBox}>
                  <strong>Comment:</strong>
                  <p>{selectedApp.commercialReview?.comment || 'No comment provided'}</p>
                </div>
              </div>

              <div className={styles.reviewDetailBox}>
                <h4>🌍 Waajira Aadaaf Turizimii (Language Office)</h4>
                <p><strong>Decision:</strong> <span className={`${styles.reviewBadge} ${styles[selectedApp.languageReview?.status.toLowerCase()]}`}>{selectedApp.languageReview?.status}</span></p>
                <p><strong>Reviewed by:</strong> {selectedApp.languageReview?.reviewedBy}</p>
                <p><strong>Date:</strong> {formatDate(selectedApp.languageReview?.reviewedAt)}</p>
                <div className={styles.commentBox}>
                  <strong>Comment:</strong>
                  <p>{selectedApp.languageReview?.comment || 'No comment provided'}</p>
                </div>
              </div>
            </div>

            <div className={styles.decisionForm}>
              <Textarea
                label="Your Final Decision Reason"
                rows={4}
                placeholder="Explain your final decision based on both department reviews..."
                value={decisionForm.reason}
                onChange={(e) => setDecisionForm({ ...decisionForm, reason: e.target.value })}
                required
              />

              <div className={styles.decisionButtons}>
                <Button
                  variant="danger"
                  onClick={() => handleFinalDecision('REJECTED')}
                  loading={finalizing}
                  disabled={finalizing}
                >
                  ❌ Reject Application
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleFinalDecision('APPROVED')}
                  loading={finalizing}
                  disabled={finalizing}
                >
                  ✅ Approve Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
