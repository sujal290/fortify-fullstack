// PATH: client/src/components/ProductGallery.jsx  (NEW FILE)
'use client';
import { useState } from 'react';

/**
 * Main image + thumbnail strip for the product detail page.
 * Falls back to the category icon when a product has no uploaded images.
 */
export default function ProductGallery({ images = [], fallbackIcon }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-[460px] bg-gradient-to-br from-[#f0ece4] to-cream border border-[#eee] flex items-center justify-center text-[110px]">
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div>
      <div className="h-[460px] bg-gradient-to-br from-[#f0ece4] to-cream border border-[#eee] flex items-center justify-center overflow-hidden mb-3">
        <img src={images[active].url} alt="" className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.publicId || i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 border-2 overflow-hidden ${active === i ? 'border-gold' : 'border-[#eee]'}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}