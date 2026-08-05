'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/slices/cartSlice';
import * as cartService from '@/services/cartService';
import { useToast } from './useToast';

export function useCart() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const items = useSelector((s) => s.cart.items);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0);

  const addItem = async (productId, qty = 1) => {
    const cart = await cartService.addToCart(productId, qty);
    dispatch(setCart(cart.items));
    showToast('Added to cart');
  };

  const updateItem = async (productId, qty) => {
    const cart = await cartService.updateCartItem(productId, qty);
    dispatch(setCart(cart.items));
  };

  const removeItem = async (productId) => {
    const cart = await cartService.removeCartItem(productId);
    dispatch(setCart(cart.items));
  };

  return { items, count, total, addItem, updateItem, removeItem };
}
