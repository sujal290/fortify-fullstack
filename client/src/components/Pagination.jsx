export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 border border-[#ddd] text-sm disabled:opacity-40"
      >
        ‹
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-9 h-9 border text-sm ${page === i + 1 ? 'bg-navy text-cream border-navy' : 'border-[#ddd] hover:border-navy'}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 border border-[#ddd] text-sm disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
