import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

export default function Footer() {
  return (
    <footer className="bg-navy text-[#c9d0d9] pt-16 pb-6 border-t border-gold/25">
      <div className="max-w-6xl mx-auto px-7 grid md:grid-cols-4 gap-10 pb-10">
        <div>
          <span className="font-display text-2xl text-cream tracking-[0.15em]">FORTIFY</span>
          <p className="text-[13px] mt-3 max-w-xs">Strength in every stitch. A Shankar &amp; Brothers company.</p>
        </div>
        <div>
          <h4 className="text-cream text-[11px] tracking-[0.12em] uppercase mb-4">Shop</h4>
          <ul className="space-y-2.5 text-[13px]">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.name}><Link href={`/shop?category=${encodeURIComponent(c.name)}`} className="hover:text-gold-light">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-cream text-[11px] tracking-[0.12em] uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-[13px]">
            <li><Link href="/story" className="hover:text-gold-light">Our Story</Link></li>
            <li><Link href="/shop" className="hover:text-gold-light">Shop All</Link></li>
            <li><Link href="/login" className="hover:text-gold-light">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream text-[11px] tracking-[0.12em] uppercase mb-4">Contact</h4>
          <ul className="space-y-2.5 text-[13px]">
            <li>Shankar &amp; Brothers</li>
            <li>hello@fortify.com</li>
            <li>+91 98xxxxxx00</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-7 border-t border-white/10 pt-5 text-center text-[11px] text-[#8891a0] tracking-[0.05em]">
        © 2026 Fortify — Shankar &amp; Brothers.
      </div>
    </footer>
  );
}
