'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import Chip from '@/ui/Chip';
import { SkeletonProductCard } from '@/ui/Skeleton';
import { CATEGORIES } from '@/constants/categories';
import { usePagination } from '@/hooks/usePagination';
import { fetchProducts } from '@/services/productService';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const { page, setPage } = usePagination(0);

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, page],
    queryFn: () => fetchProducts({ category: category === 'All' ? undefined : category, page }),
  });

  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7">
          <h1 className="font-display text-3xl">Shop All</h1>
          <div className="mt-1.5"><Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} /></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-7 py-11">
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {['All', ...CATEGORIES.map((c) => c.name)].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonProductCard key={i} />)}
          </div>
        ) : data?.products?.length ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        ) : (
          <EmptyState title="No products in this category yet." />
        )}
      </div>
    </MainLayout>
  );
}
