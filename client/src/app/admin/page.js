'use client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import Badge from '@/ui/Badge';
import { fetchProducts } from '@/services/productService';
import { fetchAllOrders } from '@/services/orderService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function DashboardContent() {
  const { data: productData } = useQuery({ queryKey: ['products', 'admin-count'], queryFn: () => fetchProducts({ limit: 1 }) });
  const { data: orders } = useQuery({ queryKey: ['orders', 'all'], queryFn: fetchAllOrders });

  const revenue = orders?.reduce((s, o) => s + o.totalPrice, 0) || 0;
  const stats = [
    ['Products', productData?.total ?? '—'],
    ['Orders', orders?.length ?? '—'],
    ['Total Revenue', fmt(revenue)],
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h2 className="font-display text-3xl">Dashboard</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[18px] mb-9">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white border border-[#eee] border-l-[3px] border-l-gold p-5 px-[22px]">
            <b className="font-display text-3xl block text-navy">{value}</b>
            <span className="text-[11px] tracking-[0.05em] uppercase text-muted">{label}</span>
          </div>
        ))}
      </div>
      <h3 className="font-display text-xl mb-3.5">Recent Orders</h3>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>{['Order', 'Customer', 'Total', 'Status'].map((h) => <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>)}</tr>
        </thead>
        <tbody>
          {orders?.slice(0, 5).map((o) => (
            <tr key={o._id}>
              <td className="p-3.5 text-sm border-b border-[#eee]">#{o._id.slice(-6).toUpperCase()}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{o.user?.email}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{fmt(o.totalPrice)}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]"><Badge tone={o.status}>{o.status}</Badge></td>
            </tr>
          )) || (
            <tr><td colSpan={4} className="p-6 text-center text-muted">No orders yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
