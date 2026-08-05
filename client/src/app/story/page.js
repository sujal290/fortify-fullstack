import MainLayout from '@/layouts/MainLayout';

export default function StoryPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7"><h1 className="font-display text-3xl">Our Story</h1></div>
      </div>
      <section className="bg-navy text-cream">
        <div className="max-w-6xl mx-auto px-7 grid md:grid-cols-2 gap-16 items-center py-20">
          <div>
            <div className="text-[11px] tracking-[0.28em] uppercase text-gold-light mb-3">Shankar &amp; Brothers</div>
            <h2 className="font-display text-4xl font-semibold mb-4">A workshop, before it was a brand.</h2>
            <p className="text-[#c9d0d9] text-[14.5px] leading-relaxed mb-4">
              Fortify began on the factory floor of Shankar &amp; Brothers, where three generations
              have cut, stitched and stress-tested bags long before &quot;Fortify&quot; was a name on a label.
            </p>
            <p className="text-[#c9d0d9] text-[14.5px] leading-relaxed mb-4">
              Manish, proprietor, still signs off every new pattern before it goes into production —
              the same standard the workshop has run on since day one.
            </p>
            <p className="text-[#c9d0d9] text-[14.5px] leading-relaxed">
              Today Fortify makes backpacks, laptop bags, travel bags, totes, slings, luggage,
              duffels and school bags — one range, one promise: strength in every stitch.
            </p>
          </div>
          <div className="h-[360px] bg-gradient-to-br from-[#1a2b42] to-[#0c1420] flex items-center justify-center text-[120px]">🏭</div>
        </div>
      </section>
    </MainLayout>
  );
}
