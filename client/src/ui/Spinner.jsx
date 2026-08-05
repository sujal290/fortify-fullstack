export default function Spinner({ size = 24, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-navy/20 border-t-navy ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
