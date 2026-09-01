import styles from './Skeleton.module.css';

export function SkeletonText({ lines = 3, width }) {
  return (
    <div className={styles.group}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-text ${styles.line}`}
          style={{ width: width ?? (i === lines - 1 ? '60%' : '100%') }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ height = 100 }) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: 'var(--radius-lg)', marginBottom: 16 }}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className={styles.tableWrap}>
      {/* header */}
      <div className={styles.tableRow} style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.cell}`} style={{ height: 12, width: '70%' }} />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.tableRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`skeleton ${styles.cell}`} style={{ height: 14, width: c === 0 ? '40%' : '75%' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={100} />
      ))}
    </div>
  );
}
