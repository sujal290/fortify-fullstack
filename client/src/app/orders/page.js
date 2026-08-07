// PATH: client/src/app/orders/page.js  (REPLACES existing file — adds Manage Addresses link)
// PATH: client/src/app/orders/page.js  (REPLACES existing file)
'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmptyState from '@/components/EmptyState';
import Badge from '@/ui/Badge';
import { SkeletonTableRow } from '@/ui/Skeleton';
import { fetchMyOrders } from '@/services/orderService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function OrdersTable() {
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders', 'mine'], queryFn: fetchMyOrders });

  if (!isLoading && orders?.length === 0) {
    return <EmptyState icon="📦" title="You haven't placed any orders yet." />;
  }

  return (
    <table className="w-full border-collapse bg-white">
      <thead>
        <tr>
          {['Order', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
            <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)
          : orders.map((o) => (
              <tr key={o._id}>
                <td className="p-3.5 text-sm border-b border-[#eee]">#{o._id.slice(-6).toUpperCase()}</td>
                <td className="p-3.5 text-sm border-b border-[#eee]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3.5 text-sm border-b border-[#eee]">{o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}</td>
                <td className="p-3.5 text-sm border-b border-[#eee]">{fmt(o.totalPrice)}</td>
                <td className="p-3.5 text-sm border-b border-[#eee]"><Badge tone={o.status}>{o.status}</Badge></td>
                <td className="p-3.5 text-sm border-b border-[#eee]">
                  <Link href={`/orders/${o._id}`} className="text-navy hover:text-gold text-xs uppercase tracking-[0.05em] font-semibold">Track</Link>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
}

export default function MyOrdersPage() {
  return (
    <MainLayout>
      <div className="bg-white border-b border-[#eee] py-8">
        <div className="max-w-6xl mx-auto px-7 flex items-center justify-between">
          <h1 className="font-display text-3xl">My Orders</h1>
          <Link href="/addresses" className="text-[12px] uppercase tracking-[0.05em] text-navy hover:text-gold font-semibold">Manage Addresses</Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-7 py-11">
        <ProtectedRoute>
          <OrdersTable />
        </ProtectedRoute>
      </div>
    </MainLayout>
  );
}