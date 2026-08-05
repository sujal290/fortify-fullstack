'use client';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/ui/Button';
import { useWishlist } from '@/hooks/useWishlist';

function WishlistContent() {
  const { products } = useWishlist();

  if (products.length === 0) {
    return <EmptyState icon="♡" title="Nothing saved yet." action={<Link href="/shop"><Button variant="dark">Browse the Shop</Button></Link>} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-7 py-11">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7"><h1 className="font-display text-3xl">My Wishlist</h1></div>
      </div>
      <ProtectedRoute>
        <WishlistContent />
      </ProtectedRoute>
    </MainLayout>
  );
}
