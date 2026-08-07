// PATH: client/src/sections/ProductShelf.jsx  (NEW FILE — also DELETE the old client/src/sections/FeaturedProducts.jsx, it's no longer used)
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import { SkeletonProductCard } from '@/ui/Skeleton';
import SectionHeading from './SectionHeading';

/**
 * Reusable homepage row driven by a product flag (isFeatured / isNewArrival /
 * isBestSeller). Renders nothing if no products carry that flag yet, so an
 * empty section never shows on a freshly-launched store.
 */
export default function ProductShelf({ filterKey, eyebrow, title, subtitle, limit = 4 }) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'shelf', filterKey],
    queryFn: () => fetchProducts({ [filterKey]: 'true', limit }),
  });

  if (!isLoading && (!data?.products || data.products.length === 0)) return null;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-7">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => <SkeletonProductCard key={i} />)
            : data.products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}