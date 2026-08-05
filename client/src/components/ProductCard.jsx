'use client';
import Link from 'next/link';
import { useState } from 'react';
import Card from '@/ui/Card';
import Button from '@/ui/Button';
import WishlistButton from './WishlistButton';
import { CATEGORIES } from '@/constants/categories';
import { useCart } from '@/hooks/useCart';

const iconFor = (category) => CATEGORIES.find((c) => c.name === category)?.icon || '👜';
const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(product._id);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card hover className="group relative">
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product._id} />
      </div>
      <Link href={`/product/${product._id}`}>
        <div className="h-[200px] flex items-center justify-center text-5xl bg-gradient-to-br from-[#eee7db] to-cream rounded-t-[70px] overflow-hidden">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            iconFor(product.category)
          )}
        </div>
        <div className="p-4 pb-5">
          <div className="text-[10px] tracking-[0.1em] uppercase text-gold mb-1.5">{product.category}</div>
          <h3 className="font-display text-lg font-semibold mb-1.5 leading-tight">{product.name}</h3>
          <div className="text-sm font-semibold text-navy">
            {fmt(product.price)}
            {product.mrp > product.price && (
              <span className="text-xs text-muted line-through ml-2 font-normal">{fmt(product.mrp)}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button variant="dark" size="sm" fullWidth loading={adding} onClick={handleAdd}>
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
