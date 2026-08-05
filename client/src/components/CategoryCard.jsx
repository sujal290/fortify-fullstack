import Link from 'next/link';

export default function CategoryCard({ name, icon }) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(name)}`}
      className="text-center border-r border-[#eee] last:border-r-0 py-1.5 px-2 text-[10.5px] tracking-[0.08em] uppercase text-navy hover:text-gold transition-colors block"
    >
      <span className="text-2xl mb-2 block">{icon}</span>
      {name}
    </Link>
  );
}
