import Button from './Button';

export default function EmptyState({
  icon = '📭',
  title = 'No data found',
  message,
  action,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__text">{message}</p>}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}
