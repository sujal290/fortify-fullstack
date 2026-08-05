export default function Card({ children, className = '', hover = false, archTop = false }) {
  return (
    <div
      className={[
        'bg-white border border-[#eee]',
        archTop ? 'rounded-t-[70px]' : '',
        hover ? 'transition-all duration-200 hover:border-gold hover:-translate-y-1 hover:shadow-[0_14px_30px_-18px_rgba(15,27,42,0.35)]' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
