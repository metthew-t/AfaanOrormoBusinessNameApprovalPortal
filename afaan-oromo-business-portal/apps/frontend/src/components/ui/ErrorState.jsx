import Button from './Button';

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="error-state__icon">⚠️</div>
      <h3 className="error-state__title">Something went wrong</h3>
      <p className="error-state__text">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </div>
  );
}
