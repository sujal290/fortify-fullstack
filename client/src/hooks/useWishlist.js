'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlist } from '@/redux/slices/wishlistSlice';
import * as wishlistService from '@/services/wishlistService';
import { useToast } from './useToast';

export function useWishlist() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const products = useSelector((s) => s.wishlist.products);

  const isSaved = (productId) => products.some((p) => p._id === productId);

  const toggle = async (productId) => {
    if (isSaved(productId)) {
      const wl = await wishlistService.removeFromWishlist(productId);
      dispatch(setWishlist(wl.products));
      showToast('Removed from wishlist');
    } else {
      const wl = await wishlistService.addToWishlist(productId);
      dispatch(setWishlist(wl.products));
      showToast('Saved to wishlist');
    }
  };

  return { products, isSaved, toggle };
}
