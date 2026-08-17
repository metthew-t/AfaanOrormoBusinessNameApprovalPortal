import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './ErrorPages.module.css';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { homePath, isAuthenticated } = useAuth();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <div className={styles.errorCode}>403</div>
        <h1 className={styles.errorTitle}>Access Denied</h1>
        <p className={styles.errorText}>
          You do not have permission to access this page.
          Please contact your administrator if you believe this is a mistake.
        </p>
        <div className={styles.errorActions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(isAuthenticated ? homePath : '/login')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Back to Login'}
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
