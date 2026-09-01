import { useId } from 'react';
import styles from './Input.module.css';
import selectStyles from './Select.module.css';

export default function Select({
  label,
  error,
  hint,
  required = false,
  options = [],
  placeholder = 'Select…',
  className = '',
  id,
  ...rest
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
        <select
          id={selectId}
          className={`${styles.input} ${selectStyles.select}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={selectStyles.arrow} aria-hidden="true">▾</span>
      </div>
      {error && <p className={styles.error} role="alert">⚠ {error}</p>}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
