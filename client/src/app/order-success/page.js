'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import Button from '@/ui/Button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="text-center py-24 px-5">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="font-display text-3xl mb-2.5">Order Confirmed</h2>
      {orderId && <p className="text-muted">Order <b className="text-ink">#{orderId.slice(-6).toUpperCase()}</b> has been placed.</p>}
      <div className="flex gap-3.5 justify-center mt-7">
        <Link href="/orders"><Button variant="dark">View My Orders</Button></Link>
        <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <OrderSuccessContent />
      </Suspense>
    </MainLayout>
  );
}
