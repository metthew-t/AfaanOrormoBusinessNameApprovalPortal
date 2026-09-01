const ICONS = {
  success: '✓',
  warning: '⚠',
  danger:  '✕',
  info:    'ℹ',
};

export default function Alert({ variant = 'info', title, children, onClose }) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      <span style={{ fontSize: 16, flexShrink: 0 }}>{ICONS[variant]}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <strong style={{ display: 'block', marginBottom: children ? 2 : 0 }}>
            {title}
          </strong>
        )}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: 14, padding: 0 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
