'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import WishlistButton from '@/components/WishlistButton';
import ReviewSection from '@/components/ReviewSection';
import Button from '@/ui/Button';
import { CATEGORIES } from '@/constants/categories';
import { fetchProductById } from '@/services/productService';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

const iconFor = (category) => CATEGORIES.find((c) => c.name === category)?.icon || '👜';
const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  if (isLoading || !product) {
    return <MainLayout><div className="py-24 text-center text-muted">Loading…</div></MainLayout>;
  }

  const handleAdd = async () => {
    setAdding(true);
    try { await addItem(product._id); } finally { setAdding(false); }
  };

  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: product.name }]} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-7 py-14 grid md:grid-cols-2 gap-16">
        <div className="h-[460px] bg-gradient-to-br from-[#f0ece4] to-cream border border-[#eee] flex items-center justify-center text-[110px] overflow-hidden">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            iconFor(product.category)
          )}
        </div>
        <div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-gold mb-2.5">{product.category}</div>
          <h1 className="font-display text-4xl mb-3">{product.name}</h1>
          <div className="text-2xl font-bold mb-5">
            {fmt(product.price)}
            {product.mrp > product.price && <span className="text-base text-muted line-through ml-2.5 font-normal">{fmt(product.mrp)}</span>}
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>
          <div className="flex gap-6 py-5 border-y border-[#eee] mb-6">
            <div className="text-[11.5px] text-muted"><b className="block text-ink text-[12.5px] mb-0.5">Availability</b>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
            <div className="text-[11.5px] text-muted"><b className="block text-ink text-[12.5px] mb-0.5">Delivery</b>3–5 business days</div>
            <div className="text-[11.5px] text-muted"><b className="block text-ink text-[12.5px] mb-0.5">Warranty</b>Lifetime hardware</div>
          </div>
          <div className="flex gap-3.5">
            <Button variant="dark" loading={adding} onClick={handleAdd}>Add to Cart</Button>
            <Button variant="primary" onClick={async () => { await handleAdd(); router.push('/cart'); }}>Buy Now</Button>
            <WishlistButton productId={product._id} className="!w-11 !h-11" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-7 pb-20">
        <ReviewSection productId={product._id} />
      </div>
    </MainLayout>
  );
}
