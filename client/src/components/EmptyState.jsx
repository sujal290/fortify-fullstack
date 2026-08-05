export default function EmptyState({ icon = '🔍', title, action }) {
  return (
    <div className="text-center py-20 px-5 text-muted">
      <div className="text-5xl mb-4">{icon}</div>
      <p>{title}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
