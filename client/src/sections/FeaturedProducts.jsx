'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import { SkeletonProductCard } from '@/ui/Skeleton';
import SectionHeading from './SectionHeading';

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ limit: 8 }),
  });

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-7">
        <SectionHeading eyebrow="Bestsellers" title="Fan favourites" subtitle="The pieces our customers reach for first, across the full Fortify range." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonProductCard key={i} />)
            : data?.products?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
