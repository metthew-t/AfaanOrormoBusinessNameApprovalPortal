import toast from 'react-hot-toast';

/**
 * Thin wrapper around react-hot-toast for consistent usage.
 */
export function useToast() {
  return {
    success: (msg) => toast.success(msg, { duration: 3500 }),
    error:   (msg) => toast.error(msg,   { duration: 4500 }),
    info:    (msg) => toast(msg,          { duration: 3500, icon: 'ℹ️' }),
    warning: (msg) => toast(msg,          { duration: 4000, icon: '⚠️' }),
    loading: (msg) => toast.loading(msg),
    dismiss: (id)  => toast.dismiss(id),
  };
}
