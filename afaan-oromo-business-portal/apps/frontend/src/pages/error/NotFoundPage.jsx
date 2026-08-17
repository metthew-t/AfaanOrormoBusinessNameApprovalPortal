import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './ErrorPages.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { homePath, isAuthenticated } = useAuth();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.errorTitle}>Page Not Found</h1>
        <p className={styles.errorText}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className={styles.errorActions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(isAuthenticated ? homePath : '/login')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Back to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
