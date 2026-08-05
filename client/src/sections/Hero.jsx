import Link from 'next/link';
import Button from '@/ui/Button';

export default function Hero() {
  return (
    <section className="bg-navy text-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-7 grid md:grid-cols-2 gap-12 items-center py-20 md:py-24">
        <div>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-gold-light mb-5">
            <span className="w-6 h-px bg-gold" /> Shankar &amp; Brothers <span className="w-6 h-px bg-gold" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-5">
            Built for the <em className="italic text-gold-light">long carry.</em>
          </h1>
          <p className="text-[15px] text-[#c9d0d9] leading-relaxed max-w-md mb-8">
            Fortify makes bags for people who move — leather-trimmed backpacks, hardshell
            luggage and everyday carry, engineered to outlast the trip.
          </p>
          <div className="flex gap-4">
            <Link href="/shop"><Button variant="primary" size="lg">Shop the Collection</Button></Link>
            <Link href="/story"><Button variant="outline" size="lg" className="border-gold text-cream">Our Story</Button></Link>
          </div>
        </div>
        <div className="h-[420px] bg-gradient-to-br from-[#1a2b42] to-[#0c1420] rounded-t-[190px] border border-gold/30 flex items-end justify-center">
          <span className="font-display text-[210px] leading-none text-gold/20 -mb-2">F</span>
        </div>
      </div>
    </section>
  );
}
