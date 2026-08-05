'use client';
import { useCallback } from 'react';
import { createRazorpayOrder, verifyPayment } from '@/services/paymentService';

const loadScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * Opens Razorpay's hosted checkout for a Fortify order that's already been
 * created (server-side, unpaid). Resolves once the signature has been
 * verified server-side, or rejects if the user cancels / it fails.
 */
export function useRazorpay() {
  const payForOrder = useCallback(async (order, userInfo) => {
    const loaded = await loadScript();
    if (!loaded) throw new Error('Could not load the payment gateway. Check your connection and try again.');

    const rzpOrder = await createRazorpayOrder(order._id);

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.razorpayOrderId,
        name: 'Fortify',
        description: `Order #${order._id.slice(-6).toUpperCase()}`,
        theme: { color: '#0F1B2A' },
        prefill: { name: userInfo?.name, email: userInfo?.email },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve(result.order);
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      });
      rzp.on('payment.failed', () => reject(new Error('Payment failed — please try again')));
      rzp.open();
    });
  }, []);

  return { payForOrder };
}
