import { STATUS_LABELS, STATUS_BADGE_VARIANT } from '@/constants/statuses';

const DOT_COLORS = {
  success: '#1a6b3c',
  warning: '#b45309',
  danger:  '#b91c1c',
  info:    '#1d4ed8',
  neutral: '#4b5563',
  orange:  '#c2410c',
  primary: '#1a6b3c',
};

export default function StatusBadge({ status, label, variant }) {
  const resolvedLabel   = label   ?? STATUS_LABELS[status]        ?? status;
  const resolvedVariant = variant ?? STATUS_BADGE_VARIANT[status] ?? 'neutral';

  return (
    <span className={`badge badge-${resolvedVariant}`} title={resolvedLabel}>
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: DOT_COLORS[resolvedVariant] ?? '#4b5563',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {resolvedLabel}
    </span>
  );
}
