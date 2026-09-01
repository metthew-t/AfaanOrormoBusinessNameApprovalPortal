import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', label = 'Loading…', centered = false }) {
  const cls = [styles.spinner, styles[size], centered ? styles.centered : ''].join(' ');
  return (
    <span className={cls} role="status" aria-label={label}>
      <span className={styles.ring} />
    </span>
  );
}

export function PageSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <LoadingSpinner size="lg" label="Loading page…" />
    </div>
  );
}
