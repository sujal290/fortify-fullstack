'use client';

export default function QuantityStepper({ qty, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-[#ddd]">
      <button
        aria-label="Decrease quantity"
        className="w-8 h-8 bg-cream text-sm hover:bg-black/5"
        onClick={() => onChange(Math.max(min, qty - 1))}
      >
        −
      </button>
      <span className="w-9 text-center text-[13px]">{qty}</span>
      <button
        aria-label="Increase quantity"
        className="w-8 h-8 bg-cream text-sm hover:bg-black/5"
        onClick={() => onChange(Math.min(max, qty + 1))}
      >
        +
      </button>
    </div>
  );
}
