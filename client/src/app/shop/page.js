// PATH: client/src/app/shop/page.js  (REPLACES existing file)
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
import Select from '@/ui/Select';
import { SkeletonProductCard } from '@/ui/Skeleton';
import { CATEGORIES } from '@/constants/categories';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchProducts, fetchProductTags } from '@/services/productService';

const PRICE_RANGES = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under ₹2,000', min: undefined, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: undefined },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState(0); // index into PRICE_RANGES
  const [tag, setTag] = useState(null);
  const { page, setPage } = usePagination(0);
  const debouncedSearch = useDebounce(search, 400);

  const { data: tags } = useQuery({ queryKey: ['products', 'tags'], queryFn: fetchProductTags });

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, debouncedSearch, sort, priceRange, tag, page],
    queryFn: () =>
      fetchProducts({
        category: category === 'All' ? undefined : category,
        search: debouncedSearch || undefined,
        sort,
        minPrice: PRICE_RANGES[priceRange].min,
        maxPrice: PRICE_RANGES[priceRange].max,
        tag: tag || undefined,
        page,
      }),
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
        {/* Search + sort row */}
        <div className="flex flex-col md:flex-row gap-3.5 mb-7">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bags, categories, materials…"
            className="flex-1 px-4 py-3 border border-[#ddd] text-sm outline-none focus:border-gold"
          />
          <div className="w-full md:w-56">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-4">
          {['All', ...CATEGORIES.map((c) => c.name)].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>

        {/* Price range chips */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-4">
          {PRICE_RANGES.map((r, i) => (
            <Chip key={r.label} active={priceRange === i} onClick={() => setPriceRange(i)}>{r.label}</Chip>
          ))}
        </div>

        {/* Tag chips — only shows if any products actually have tags set */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Chip active={!tag} onClick={() => setTag(null)}>All Tags</Chip>
            {tags.map((t) => (
              <Chip key={t} active={tag === t} onClick={() => setTag(t)}>{t}</Chip>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonProductCard key={i} />)}
          </div>
        ) : data?.products?.length ? (
          <>
            <p className="text-[12px] text-muted mb-5">{data.total} product{data.total !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        ) : (
          <EmptyState title="No products match your search." />
        )}
      </div>
    </MainLayout>
  );
}