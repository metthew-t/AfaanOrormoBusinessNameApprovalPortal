import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync, useMutation } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { getIncomingApplications, routeApplication, acceptApplication, rejectApplication } from '@/services/communicationService';
import { formatDate } from '@/utils/formatters';
import { extractErrorMessage } from '@/utils/apiHelpers';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import Textarea from '@/components/ui/Textarea';
import styles from './IncomingApplicationsPage.module.css';

export default function IncomingApplicationsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, refetch } = useAsync(() => getIncomingApplications(), []);
  const { mutate: route, loading: routing } = useMutation(routeApplication);
  const { mutate: accept, loading: accepting } = useMutation(acceptApplication);
  const { mutate: reject, loading: rejecting } = useMutation(rejectApplication);

  const [selectedApp, setSelectedApp] = useState(null);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState(''); // 'accept' or 'reject'
  const [reason, setReason] = useState('');
  const [routeError, setRouteError] = useState(null);
  const [decisionError, setDecisionError] = useState(null);

  const handleRouteClick = (app) => {
    setSelectedApp(app);
    setRouteModalOpen(true);
    setRouteError(null);
  };

  const handleDecisionClick = (app, type) => {
    setSelectedApp(app);
    setDecisionType(type);
    setReason('');
    setDecisionError(null);
    setDecisionModalOpen(true);
  };

  const handleRoute = async () => {
    if (!selectedApp) return;
    
    setRouteError(null);
    try {
      // Route the application: description to Addaf Turizm, permits to Commercial
      await route({
        applicationId: selectedApp.id,
        routeToCommercial: true,
        routeToTurizm: true,
      });
      
      toast.success('Application routed successfully to Commercial Office and Addaf Turizm Biro');
      setRouteModalOpen(false);
      setSelectedApp(null);
      refetch();
    } catch (err) {
      setRouteError(extractErrorMessage(err));
    }
  };

  const handleDecisionSubmit = async () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setDecisionError('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    setDecisionError(null);
    try {
      if (decisionType === 'accept') {
        await accept({
          applicationId: selectedApp.id,
          reason: reason.trim(),
        });
        toast.success('Application accepted! Message sent to business owner.');
      } else {
        await reject({
          applicationId: selectedApp.id,
          reason: reason.trim(),
        });
        toast.success('Application rejected. Message sent to business owner.');
      }
      
      setDecisionModalOpen(false);
      setSelectedApp(null);
      setReason('');
      refetch();
    } catch (err) {
      setDecisionError(extractErrorMessage(err));
    }
  };

  const columns = [
    { key: 'applicationNumber', label: 'Application No.', width: 160 },
    { key: 'businessName', label: 'Business Name' },
    { 
      key: 'owner', 
      label: 'Business Owner', 
      render: (v) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v?.fullName ?? '—'}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {v?.email ?? ''}
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'submittedAt', label: 'Received', render: (v) => formatDate(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', alignItems: 'center' }}>
          {row.status === 'SUBMITTED' && (
            <>
              <button
                onClick={() => handleDecisionClick(row, 'accept')}
                className={styles.iconButton}
                title="Accept Application"
                style={{ color: 'var(--color-success)', fontSize: '20px' }}
              >
                ✅
              </button>
              <button
                onClick={() => handleDecisionClick(row, 'reject')}
                className={styles.iconButton}
                title="Reject Application"
                style={{ color: 'var(--color-danger)', fontSize: '20px' }}
              >
                ❌
              </button>
              <Button 
                size="sm" 
                variant="primary" 
                onClick={() => handleRouteClick(row)}
              >
                Route →
              </Button>
            </>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => navigate(`/communication/applications/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>Incoming Applications</h1>
        <p>Review applications from business owners and route to specialized departments</p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyIcon="📬"
          emptyTitle="No incoming applications"
          emptyMessage="All applications have been routed to the appropriate departments."
        />
      </div>

      {/* Route Confirmation Modal */}
      <Modal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        title="Route Application"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRouteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoute} loading={routing}>
              Confirm Routing
            </Button>
          </>
        }
      >
        <div className={styles.routeModalContent}>
          {routeError && (
            <Alert variant="danger" onClose={() => setRouteError(null)}>
              {routeError}
            </Alert>
          )}

          {selectedApp && (
            <>
              <div className={styles.appSummary}>
                <h3>{selectedApp.businessName}</h3>
                <p className={styles.appNumber}>{selectedApp.applicationNumber}</p>
                <p className={styles.appOwner}>
                  Owner: {selectedApp.owner?.fullName ?? '—'}
                </p>
              </div>

              <div className={styles.routingPlan}>
                <p className={styles.routingTitle}>This application will be routed to:</p>
                
                <div className={styles.routingItem}>
                  <div className={styles.routingIcon}>🌍</div>
                  <div className={styles.routingDetails}>
                    <h4>Addaf Turizm Biro</h4>
                    <p>Business description will be reviewed for Afaan Oromo language compliance</p>
                    <div className={styles.routingContent}>
                      <strong>Description:</strong>
                      <p>{selectedApp.description}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.routingItem}>
                  <div className={styles.routingIcon}>🏛️</div>
                  <div className={styles.routingDetails}>
                    <h4>Commercial Office</h4>
                    <p>Business permission certificate will be reviewed for compliance</p>
                    <div className={styles.routingContent}>
                      <strong>Document:</strong>
                      <p>{selectedApp.permissionDocument?.fileName ?? 'Permission document uploaded'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert variant="info">
                Both departments will review the application simultaneously. Final approval requires both departments to approve.
              </Alert>
            </>
          )}
        </div>
      </Modal>

      {/* Accept/Reject Decision Modal */}
      <Modal
        open={decisionModalOpen}
        onClose={() => !accepting && !rejecting && setDecisionModalOpen(false)}
        title={decisionType === 'accept' ? '✅ Accept Application' : '❌ Reject Application'}
      >
        <div className={styles.decisionModalContent}>
          {decisionError && (
            <Alert variant="danger" onClose={() => setDecisionError(null)}>
              {decisionError}
            </Alert>
          )}

          {selectedApp && (
            <>
              <div className={styles.appSummary}>
                <h3>{selectedApp.businessName}</h3>
                <p className={styles.appNumber}>{selectedApp.applicationNumber}</p>
                <p className={styles.appOwner}>
                  Owner: {selectedApp.owner?.fullName ?? '—'}
                </p>
              </div>

              <Alert variant={decisionType === 'accept' ? 'success' : 'warning'}>
                {decisionType === 'accept' 
                  ? 'You are about to accept this application. A message will be sent to the business owner explaining why it was accepted.'
                  : 'You are about to reject this application. A message will be sent to the business owner explaining why it was rejected.'}
              </Alert>

              <Textarea
                label={`Reason for ${decisionType === 'accept' ? 'Acceptance' : 'Rejection'}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  decisionType === 'accept'
                    ? 'Explain why this application meets all initial requirements and is being accepted...'
                    : 'Explain specifically why this application is being rejected...'
                }
                rows={5}
                required
                error={decisionError}
              />

              <div className={styles.modalActions}>
                <Button
                  variant="ghost"
                  onClick={() => setDecisionModalOpen(false)}
                  disabled={accepting || rejecting}
                >
                  Cancel
                </Button>
                <Button
                  variant={decisionType === 'accept' ? 'success' : 'danger'}
                  onClick={handleDecisionSubmit}
                  disabled={accepting || rejecting || !reason.trim() || reason.trim().length < 10}
                  loading={accepting || rejecting}
                >
                  {decisionType === 'accept' ? 'Accept Application' : 'Reject Application'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
