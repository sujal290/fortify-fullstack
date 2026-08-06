// PATH: client/src/app/orders/[id]/page.js  (REPLACES existing file — fixes import casing bug)
'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Breadcrumb from '@/components/Breadcrumb';
import OrderTracker from '@/components/OrderTracker';
import Badge from '@/ui/Badge';
import Spinner from '@/ui/Spinner';
import { fetchOrderById } from '@/services/orderService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
  });

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size={28} /></div>;
  if (!order) return <p className="text-center py-24 text-muted">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-7 py-11">
      <div className="flex items-center justify-between mb-7">
        <h2 className="font-display text-2xl">Order #{order._id.slice(-6).toUpperCase()}</h2>
        <Badge tone={order.status}>{order.status}</Badge>
      </div>

      <div className="mb-8">
        <OrderTracker order={order} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#eee] p-6">
          <h3 className="font-display text-lg mb-3">Items</h3>
          {order.items.map((i) => (
            <div key={i.product} className="flex justify-between text-[13px] text-muted py-1.5">
              <span>{i.name} × {i.qty}</span><span>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-[#eee] mt-2 pt-3"><span>Total</span><span>{fmt(order.totalPrice)}</span></div>
        </div>
        <div className="bg-white border border-[#eee] p-6">
          <h3 className="font-display text-lg mb-3">Delivery Address</h3>
          <p className="text-[13px] text-muted leading-relaxed">
            {order.shippingAddress?.fullName}<br />
            {order.shippingAddress?.line1}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.pin}<br />
            {order.shippingAddress?.phone}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-3xl mx-auto px-7">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Orders', href: '/orders' }, { label: 'Track Order' }]} />
        </div>
      </div>
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    </MainLayout>
  );
}