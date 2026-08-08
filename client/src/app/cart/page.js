// PATH: client/src/app/cart/page.js  (REPLACES existing file — fixes a key-collision bug for multi-variant carts)
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import EmptyState from '@/components/EmptyState';
import QuantityStepper from '@/ui/QuantityStepper';
import Button from '@/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { fetchCart } from '@/services/cartService';
import { useDispatch } from 'react-redux';
import { setCart } from '@/redux/slices/cartSlice';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, total, updateItem, removeItem } = useCart();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return setLoading(false);
    fetchCart().then((cart) => dispatch(setCart(cart.items))).finally(() => setLoading(false));
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <EmptyState icon="🔒" title="Please sign in to view your cart." action={<Link href="/login"><Button variant="dark">Sign In</Button></Link>} />
      </MainLayout>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <MainLayout>
        <EmptyState icon="🛍" title="Your cart is empty." action={<Link href="/shop"><Button variant="dark">Continue Shopping</Button></Link>} />
      </MainLayout>
    );
  }

  const shipping = total > 4000 ? 0 : 199;

  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7">
          <h1 className="font-display text-3xl">Your Cart</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-7 py-11 grid md:grid-cols-[1.7fr_1fr] gap-9 items-start">
        <div>
          {items.map((i) => (
            <div key={i.product._id + (i.variantId || '')} className="grid grid-cols-[64px_1fr_auto_auto_auto] gap-4 items-center py-4.5 py-[18px] border-b border-[#eee]">
              <div className="w-16 h-16 bg-cream border border-[#eee] flex items-center justify-center text-2xl overflow-hidden">
                {i.product.images?.[0]?.url ? <img src={i.product.images[0].url} alt="" className="w-full h-full object-cover" /> : '👜'}
              </div>
              <div>
                <div className="font-semibold text-sm">{i.product.name}</div>
                <div className="text-xs text-muted">{i.variantLabel ? i.variantLabel : i.product.category}</div>
              </div>
              <QuantityStepper qty={i.qty} onChange={(q) => updateItem(i.product._id, q, i.variantId)} />
              <div className="font-semibold">{fmt(i.product.price * i.qty)}</div>
              <button onClick={() => removeItem(i.product._id, i.variantId)} className="text-red-700 text-[11px] uppercase tracking-[0.05em]">Remove</button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#eee] p-6">
          <h3 className="font-display text-xl mb-4">Order Summary</h3>
          <div className="flex justify-between text-[13px] text-muted py-2"><span>Subtotal</span><span>{fmt(total)}</span></div>
          <div className="flex justify-between text-[13px] text-muted py-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : fmt(shipping)}</span></div>
          <div className="flex justify-between font-bold border-t border-[#eee] mt-2 pt-3.5"><span>Total</span><span>{fmt(total + shipping)}</span></div>
          <Link href="/checkout"><Button variant="primary" fullWidth className="mt-4">Proceed to Checkout</Button></Link>
        </div>
      </div>
    </MainLayout>
  );
}