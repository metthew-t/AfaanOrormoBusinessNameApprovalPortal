import Modal from './Modal';
import Button from './Button';

/**
 * Confirmation dialog with a destructive / confirm action.
 *
 * Props:
 *   open         : boolean
 *   onClose      : () => void
 *   onConfirm    : () => void
 *   title        : string
 *   message      : string | ReactNode
 *   confirmLabel : string  (default 'Confirm')
 *   cancelLabel  : string  (default 'Cancel')
 *   variant      : 'danger' | 'primary'  (confirm button variant)
 *   loading      : boolean
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {message}
      </p>
    </Modal>
  );
}
