import styles from './Button.module.css';

/**
 * Reusable Button component.
 *
 * Props:
 *   variant   : 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning'
 *   size      : 'sm' | 'md' | 'lg'
 *   loading   : boolean
 *   disabled  : boolean
 *   fullWidth : boolean
 *   icon      : ReactNode (prepended)
 *   iconRight : ReactNode (appended)
 */
export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  fullWidth= false,
  icon,
  iconRight,
  className = '',
  type = 'button',
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading   ? styles.loading   : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && <span className={styles.iconLeft}>{icon}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
}
