export function SkeletonLine({ width = '100%', height = 14, className = '' }) {
  return <div className={`bg-black/[0.06] animate-pulse ${className}`} style={{ width, height }} />;
}

export function SkeletonProductCard() {
  return (
    <div className="border border-[#eee]">
      <div className="h-[200px] bg-black/[0.06] animate-pulse" />
      <div className="p-4 space-y-2">
        <SkeletonLine width="40%" height={10} />
        <SkeletonLine width="80%" height={18} />
        <SkeletonLine width="50%" height={14} />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3"><SkeletonLine height={12} /></td>
      ))}
    </tr>
  );
}
