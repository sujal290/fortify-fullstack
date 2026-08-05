'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function WishlistButton({ productId, className = '' }) {
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle } = useWishlist();
  const { showToast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const saved = isSaved(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Sign in to save items to your wishlist');
      return router.push('/login');
    }
    setPending(true);
    try {
      await toggle(productId);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`w-9 h-9 flex items-center justify-center bg-white border border-[#eee] hover:border-gold transition-colors ${className}`}
    >
      <span className={saved ? 'text-gold' : 'text-navy/40'}>{saved ? '♥' : '♡'}</span>
    </button>
  );
}
