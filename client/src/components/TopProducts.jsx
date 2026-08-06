// PATH: client/src/components/TopProducts.jsx  (NEW FILE)
const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function TopProducts({ products = [] }) {
  if (products.length === 0) {
    return <div className="bg-white border border-[#eee] p-8 text-center text-muted text-sm">No sales yet.</div>;
  }

  const maxUnits = Math.max(...products.map((p) => p.unitsSold));

  return (
    <div className="bg-white border border-[#eee] p-6">
      <h3 className="font-display text-lg mb-4">Top Products</h3>
      <div className="space-y-4">
        {products.map((p, i) => (
          <div key={p.name}>
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="font-medium text-ink">{i + 1}. {p.name}</span>
              <span className="text-muted">{p.unitsSold} sold · {fmt(p.revenue)}</span>
            </div>
            <div className="h-1.5 bg-cream">
              <div className="h-full bg-gold" style={{ width: `${(p.unitsSold / maxUnits) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}