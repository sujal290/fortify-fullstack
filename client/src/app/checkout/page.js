'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CouponBox from '@/components/CouponBox';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';
import { useCart } from '@/hooks/useCart';
import { placeOrder } from '@/services/orderService';
import { useToast } from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/redux/slices/cartSlice';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function CheckoutForm() {
  const { items, total } = useCart();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const [coupon, setCoupon] = useState(null); // { code, discount }
  const shipping = total > 4000 ? 0 : 199;
  const grandTotal = Math.max(0, total + shipping - (coupon?.discount || 0));

  const onSubmit = async (data) => {
    try {
      const order = await placeOrder({
        shippingAddress: { fullName: data.fullName, phone: data.phone, line1: data.address, city: data.city, pin: data.pin },
        paymentMethod: data.payment,
        couponCode: coupon?.code,
      });
      dispatch(clearCart());
      router.push(`/order-success?id=${order._id}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not place order', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-7 py-11 grid md:grid-cols-[1.7fr_1fr] gap-9 items-start">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white border border-[#eee] p-6 mb-5">
          <h3 className="font-display text-xl mb-4">Delivery Address</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <Input label="Full Name" error={errors.fullName?.message} {...register('fullName', { required: true })} />
            <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: true })} />
          </div>
          <Input label="Address Line" {...register('address', { required: true })} />
          <div className="grid grid-cols-2 gap-3.5">
            <Input label="City" {...register('city', { required: true })} />
            <Input label="PIN Code" {...register('pin', { required: true })} />
          </div>
        </div>
        <div className="bg-white border border-[#eee] p-6">
          <h3 className="font-display text-xl mb-4">Payment</h3>
          <Select label="Payment Method" options={['COD', 'UPI', 'CARD']} {...register('payment')} />
          <p className="text-[11.5px] text-muted">Prototype checkout — no real payment is processed yet (wire up Razorpay in orderController).</p>
        </div>
        <Button type="submit" variant="primary" fullWidth loading={isSubmitting} className="mt-5 md:hidden">Place Order</Button>
      </form>
      <div className="bg-white border border-[#eee] p-6">
        <h3 className="font-display text-xl mb-4">Order Summary</h3>
        {items.map((i) => (
          <div key={i.product._id} className="flex justify-between text-[13px] text-muted py-2">
            <span>{i.product.name} × {i.qty}</span><span>{fmt(i.product.price * i.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-[13px] text-muted py-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : fmt(shipping)}</span></div>
        {coupon && (
          <div className="flex justify-between text-[13px] text-[#1f6b40] py-2"><span>Coupon ({coupon.code})</span><span>−{fmt(coupon.discount)}</span></div>
        )}
        <div className="flex justify-between font-bold border-t border-[#eee] mt-2 pt-3.5 mb-4"><span>Total</span><span>{fmt(grandTotal)}</span></div>

        <CouponBox subtotal={total} applied={coupon} onApply={setCoupon} onRemove={() => setCoupon(null)} />

        <Button variant="primary" fullWidth className="mt-4 hidden md:flex" onClick={handleSubmit(onSubmit)}>Place Order</Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7"><h1 className="font-display text-3xl">Checkout</h1></div>
      </div>
      <ProtectedRoute>
        <CheckoutForm />
      </ProtectedRoute>
    </MainLayout>
  );
}
