export default function StoryBand() {
  return (
    <section className="bg-navy text-cream">
      <div className="max-w-6xl mx-auto px-7 grid md:grid-cols-2 gap-16 items-center py-20">
        <div className="h-[340px] bg-gradient-to-br from-[#1a2b42] to-[#0c1420] rounded-t-[110px] flex items-center justify-center text-8xl">🧵</div>
        <div>
          <div className="text-[11px] tracking-[0.28em] uppercase text-gold-light mb-3">Since the workshop floor</div>
          <h2 className="font-display text-4xl font-semibold mb-4">Strength in every stitch.</h2>
          <p className="text-[#c9d0d9] text-[14.5px] leading-relaxed mb-4">
            Every Fortify bag begins with over-engineered stress points — bar-tacked seams, YKK
            hardware, and panels chosen for how they age, not just how they photograph.
          </p>
          <p className="text-[#c9d0d9] text-[14.5px] leading-relaxed mb-6">
            Founded under Shankar &amp; Brothers, Fortify is built by people who still walk the factory floor.
          </p>
          <div className="grid grid-cols-3 gap-5">
            {[['12+', 'Years crafting'], ['50k+', 'Bags shipped'], ['4.8★', 'Customer rating']].map(([num, label]) => (
              <div key={label}>
                <b className="font-display text-3xl text-gold-light block">{num}</b>
                <span className="text-[10.5px] tracking-[0.08em] uppercase text-[#9aa5b3]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
