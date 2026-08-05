// PATH: client/src/components/OrderTracker.jsx
'use client';

const STEPS = [
  { key: 'Pending', label: 'Order Placed', icon: '🧾' },
  { key: 'Confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'Shipped', label: 'Shipped', icon: '📦' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'Delivered', label: 'Delivered', icon: '🏠' },
];

/**
 * Visual order-tracking timeline. Not a live GPS map — there's no courier
 * API wired in yet, so this reflects the order's status history instead of
 * a real vehicle position. Swap in a real map (Google Maps / a courier
 * partner's tracking widget) once that integration exists; the data shape
 * (order.trackingHistory) is already there to support it.
 */
export default function OrderTracker({ order }) {
  if (order.status === 'Cancelled') {
    return (
      <div className="bg-[#fbecec] border border-[#f3caca] text-[#7a1f1f] px-5 py-4 text-sm">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === order.status);
  const historyFor = (key) => order.trackingHistory?.find((h) => h.status === key);

  return (
    <div className="bg-white border border-[#eee] p-7">
      {order.estimatedDelivery && (
        <p className="text-[13px] text-muted mb-6">
          Estimated delivery: <b className="text-ink">{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</b>
        </p>
      )}

      <div className="relative flex justify-between">
        {/* Route line — dashed, gold once passed, gray ahead */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-[#e5e5e5] z-0">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${(Math.max(currentIndex, 0) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const entry = historyFor(step.key);
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center text-center" style={{ width: `${100 / STEPS.length}%` }}>
              <div
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center text-base border-2 mb-2.5 bg-white',
                  done ? 'border-gold text-gold' : 'border-[#ddd] text-[#bbb]',
                ].join(' ')}
              >
                {step.icon}
              </div>
              <span className={`text-[11px] uppercase tracking-[0.04em] ${done ? 'text-navy font-semibold' : 'text-muted'}`}>
                {step.label}
              </span>
              {entry && (
                <span className="text-[10px] text-muted mt-1">
                  {new Date(entry.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}