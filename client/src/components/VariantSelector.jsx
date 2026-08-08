// PATH: client/src/components/VariantSelector.jsx  (NEW FILE)
'use client';

/**
 * Two-step color → size picker for products with variants.
 * Handles color-only, size-only, or color+size products the same way —
 * a dimension with no values across any variant just doesn't render.
 */
export default function VariantSelector({ variants, selected, onSelect }) {
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const selectedColor = selected?.color;

  const sizesForColor = [...new Set(
    variants.filter((v) => !selectedColor || v.color === selectedColor).map((v) => v.size).filter(Boolean)
  )];

  const pick = (color, size) => {
    const variant = variants.find((v) => (v.color || '') === (color || '') && (v.size || '') === (size || ''));
    if (variant) onSelect(variant);
  };

  return (
    <div className="mb-6 space-y-4">
      {colors.length > 0 && (
        <div>
          <div className="text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-2">
            Color{selectedColor ? `: ${selectedColor}` : ''}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const available = variants.some((v) => v.color === c && v.stock > 0);
              return (
                <button
                  key={c}
                  disabled={!available}
                  onClick={() => pick(c, selected?.size)}
                  className={[
                    'px-4 py-2 text-[12.5px] border transition-colors',
                    selectedColor === c ? 'border-gold bg-[#faf3ea] text-navy font-semibold' : 'border-[#ddd] text-navy',
                    !available ? 'opacity-40 cursor-not-allowed line-through' : 'hover:border-gold',
                  ].join(' ')}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizesForColor.length > 0 && (
        <div>
          <div className="text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-2">
            Size{selected?.size ? `: ${selected.size}` : ''}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((s) => {
              const available = variants.some((v) => (v.color || '') === (selectedColor || '') && v.size === s && v.stock > 0);
              return (
                <button
                  key={s}
                  disabled={!available}
                  onClick={() => pick(selectedColor, s)}
                  className={[
                    'px-4 py-2 text-[12.5px] border transition-colors min-w-[44px]',
                    selected?.size === s ? 'border-gold bg-[#faf3ea] text-navy font-semibold' : 'border-[#ddd] text-navy',
                    !available ? 'opacity-40 cursor-not-allowed line-through' : 'hover:border-gold',
                  ].join(' ')}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}