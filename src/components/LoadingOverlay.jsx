export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Processing large text input...</p>
    </div>
  );
}
