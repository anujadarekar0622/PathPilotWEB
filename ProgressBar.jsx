export default function ProgressBar({ value, label, right }) {
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{right ?? `${value}%`}</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
