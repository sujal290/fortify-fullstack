'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { setWishlist } from '@/redux/slices/wishlistSlice';
import { fetchWishlist } from '@/services/wishlistService';

// No UI — just keeps the wishlist Redux slice in sync with the server
// whenever a logged-in user loads any page under MainLayout. Lets the heart
// icon on ProductCard show the right state everywhere without re-fetching
// per card.
export default function WishlistSync() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchWishlist().then((wl) => dispatch(setWishlist(wl.products))).catch(() => {});
  }, [isAuthenticated, dispatch]);

  return null;
}
