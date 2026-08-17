import { useState } from 'react';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getMessages, sendMessage, markMessageAsRead } from '@/services/communicationService';
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
  { value: 'COMMERCIAL', label: 'Commercial Office' },
  { value: 'TURIZM', label: 'Addaf Turizm Biro' },
  { value: 'BUSINESS_OWNER', label: 'Business Owner' },
];

export default function MessagesPage() {
  const toast = useToast();
  const { data: messages, loading, error, refetch } = useAsync(() => getMessages(), []);
  const { mutate: send, loading: sending } = useMutation(sendMessage);
  const { mutate: markRead } = useMutation(markMessageAsRead);

  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
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

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const messagesList = messages ?? [];
  const unreadCount = messagesList.filter(m => !m.isRead).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Messages</h1>
          <p>Communication with departments and business owners</p>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} unread</span>
          )}
        </div>
        <Button onClick={handleCompose}>+ New Message</Button>
      </div>

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
    </div>
  );
}
