import { useState } from 'react';
import styles from './Input.module.css';

/**
 * Reusable controlled Input.
 *
 * Props:
 *   label       : string
 *   error       : string | null
 *   hint        : string
 *   required    : boolean
 *   type        : html input type (default 'text')
 *   icon        : ReactNode (left icon)
 *   suffix      : ReactNode (right element, e.g. toggle)
 *   showToggle  : boolean — enables show/hide for type="password"
 */
export default function Input({
  label,
  error,
  hint,
  required = false,
  type = 'text',
  icon,
  suffix,
  showToggle = false,
  className = '',
  id,
  ...rest
}) {
  const [showPw, setShowPw] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  const resolvedType = type === 'password' && showPw ? 'text' : type;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="required"> *</span>}
        </label>
      )}

      <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.iconLeft} aria-hidden="true">{icon}</span>}

        <input
          id={inputId}
          type={resolvedType}
          className={`${styles.input} ${icon ? styles.hasIcon : ''} ${(suffix || showToggle) ? styles.hasSuffix : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />

        {showToggle && type === 'password' && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPw ? '🙈' : '👁'}
          </button>
        )}

        {!showToggle && suffix && (
          <span className={styles.suffix}>{suffix}</span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          ⚠ {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>
      )}
    </div>
  );
}
