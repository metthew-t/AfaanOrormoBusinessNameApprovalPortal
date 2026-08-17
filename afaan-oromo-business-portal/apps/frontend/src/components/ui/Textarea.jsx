import styles from './Input.module.css';
import taStyles from './Textarea.module.css';

export default function Textarea({
  label,
  error,
  hint,
  required = false,
  rows = 4,
  className = '',
  id,
  ...rest
}) {
  const taId = id || `ta-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={taId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
        <textarea
          id={taId}
          rows={rows}
          className={`${styles.input} ${taStyles.textarea}`}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </div>
      {error && <p className={styles.error} role="alert">⚠ {error}</p>}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
