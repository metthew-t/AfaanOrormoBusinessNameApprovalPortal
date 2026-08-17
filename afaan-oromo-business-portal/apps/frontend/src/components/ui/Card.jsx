import styles from './Card.module.css';

export default function Card({ children, className = '', padding = true, ...rest }) {
  return (
    <div className={`card ${styles.card} ${!padding ? styles.noPadding : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function StatCard({ icon, value, label, color = 'primary' }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: `var(--color-${color}-light, var(--color-primary-light))` }}>
        <span role="img" aria-hidden="true">{icon}</span>
      </div>
      <div className="stat-card__info">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
