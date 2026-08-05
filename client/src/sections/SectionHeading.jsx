export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-lg mx-auto mb-11">
      {eyebrow && (
        <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] uppercase text-gold mb-3">
          <span className="w-6 h-px bg-muted" /> {eyebrow} <span className="w-6 h-px bg-muted" />
        </div>
      )}
      <h2 className="font-display text-4xl font-semibold">{title}</h2>
      {subtitle && <p className="text-muted text-sm mt-2.5">{subtitle}</p>}
    </div>
  );
}
