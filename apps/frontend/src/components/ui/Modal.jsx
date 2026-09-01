import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

/**
 * Accessible Modal dialog.
 *
 * Props:
 *   open     : boolean
 *   onClose  : () => void
 *   title    : string
 *   size     : 'sm' | 'md' | 'lg'
 *   children : ReactNode
 *   footer   : ReactNode  (overrides default close button)
 */
export default function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}) {
  const dialogRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus the modal when it opens
  useEffect(() => {
    if (open) {
      // Small timeout ensures the element is fully mounted in the portal
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : '';

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className={`modal ${sizeClass}`}
        ref={dialogRef}
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              lineHeight: 1,
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer !== undefined ? (
          <div className="modal-footer">{footer}</div>
        ) : (
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
