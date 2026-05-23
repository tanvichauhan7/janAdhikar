export default function LoadingSpinner({ label }) {
  return (
    <div className="loading-block" role="status" aria-live="polite">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
