// PATH: client/src/app/checkout/page.js  (REPLACES existing file)
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CouponBox from '@/components/CouponBox';
import AddressBook from '@/components/AddressBook';
import Select from '@/ui/Select';
import Button from '@/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRazorpay } from '@/hooks/useRazorpay';
import { placeOrder } from '@/services/orderService';
import { fetchAddresses } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/redux/slices/cartSlice';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function CheckoutForm() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { showToast } = useToast();
  const { payForOrder } = useRazorpay();
  const dispatch = useDispatch();
  const router = useRouter();
  const [coupon, setCoupon] = useState(null); // { code, discount }
  const [paying, setPaying] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const shipping = total > 4000 ? 0 : 199;
  const grandTotal = Math.max(0, total + shipping - (coupon?.discount || 0));

  const { data: addresses } = useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });

  // Preselect the default address once it loads, if nothing's been chosen yet.
  useEffect(() => {
    if (!selectedAddressId && addresses?.length) {
      setSelectedAddressId((addresses.find((a) => a.isDefault) || addresses[0])._id);
    }
  }, [addresses, selectedAddressId]);

  const onSubmit = async (data) => {
    const address = addresses?.find((a) => a._id === selectedAddressId);
    if (!address) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    try {
      const order = await placeOrder({
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          city: address.city,
          state: address.state,
          pin: address.pin,
        },
        paymentMethod: data.payment,
        couponCode: coupon?.code,
      });

      if (data.payment === 'RAZORPAY') {
        setPaying(true);
        try {
          await payForOrder(order, user);
          showToast('Payment successful');
        } catch (err) {
          // Order already exists (Pending/unpaid) — customer can retry payment from My Orders.
          showToast(err.message || 'Payment was not completed', 'error');
          dispatch(clearCart());
          return router.push(`/order-success?id=${order._id}`);
        } finally {
          setPaying(false);
        }
      }

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
          <AddressBook selectedId={selectedAddressId} onSelect={setSelectedAddressId} />
        </div>
        <div className="bg-white border border-[#eee] p-6">
          <h3 className="font-display text-xl mb-4">Payment</h3>
          <Select label="Payment Method" options={['RAZORPAY', 'COD', 'UPI', 'CARD']} {...register('payment')} />
          <p className="text-[11.5px] text-muted">RAZORPAY opens a real Razorpay checkout (test mode with test keys). Other methods just record the order.</p>
        </div>
        <Button type="submit" variant="primary" fullWidth loading={isSubmitting || paying} className="mt-5 md:hidden">Place Order</Button>
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

        <Button variant="primary" fullWidth className="mt-4 hidden md:flex" loading={isSubmitting || paying} onClick={handleSubmit(onSubmit)}>Place Order</Button>
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