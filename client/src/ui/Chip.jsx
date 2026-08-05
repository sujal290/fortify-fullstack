export default function Chip({ active, children, ...props }) {
  return (
    <button
      className={[
        'px-4.5 px-[18px] py-2 text-[11px] uppercase tracking-[0.08em] border transition-colors',
        active ? 'bg-navy text-cream border-navy' : 'bg-transparent text-navy border-muted hover:border-navy',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
