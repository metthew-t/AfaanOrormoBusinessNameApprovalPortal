import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format an ISO date string to a readable date.
 * e.g. "Jan 15, 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

/**
 * Format an ISO date string to datetime.
 * e.g. "Jan 15, 2026 at 10:30 AM"
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateStr;
  }
};

/**
 * Format a relative time.
 * e.g. "3 minutes ago"
 */
export const formatRelative = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

/**
 * Format file size to human readable string.
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

/**
 * Truncate text to a maximum character count.
 */
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
};

/**
 * Generate initials from a full name.
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format a phone number for display.
 */
export const formatPhone = (phone) => {
  if (!phone) return '—';
  return phone;
};
