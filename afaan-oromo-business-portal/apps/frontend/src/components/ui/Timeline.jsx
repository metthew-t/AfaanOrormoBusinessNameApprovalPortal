import { formatDate } from '@/utils/formatters';

/**
 * Application workflow timeline.
 *
 * steps: [{ key, label, date, status: 'completed'|'active'|'pending'|'error', comment }]
 */
export default function Timeline({ steps = [] }) {
  return (
    <div className="timeline">
      {steps.map((step, idx) => (
        <div key={step.key ?? idx} className="timeline-item">
          <div className={`timeline-dot ${step.status}`} aria-hidden="true">
            {step.status === 'completed' && (
              <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>✓</span>
            )}
            {step.status === 'error' && (
              <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>✕</span>
            )}
          </div>

          <div>
            <p className="timeline-item__title">{step.label}</p>
            {step.date && (
              <p className="timeline-item__subtitle">{formatDate(step.date)}</p>
            )}
            {!step.date && step.status === 'pending' && (
              <p className="timeline-item__subtitle" style={{ color: 'var(--color-text-muted)' }}>
                Pending
              </p>
            )}
            {step.comment && (
              <p style={{
                marginTop: 4,
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                background: 'var(--color-bg)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                maxWidth: 400,
              }}>
                "{step.comment}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
