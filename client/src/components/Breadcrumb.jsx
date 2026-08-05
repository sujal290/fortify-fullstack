import Link from 'next/link';

export default function Breadcrumb({ items }) {
  // items: [{ label, href? }] — last item has no href (current page)
  return (
    <div className="text-[11px] text-muted tracking-[0.05em]">
      {items.map((item, i) => (
        <span key={item.label}>
          {item.href ? (
            <Link href={item.href} className="hover:text-gold">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-1.5">/</span>}
        </span>
      ))}
    </div>
  );
}
