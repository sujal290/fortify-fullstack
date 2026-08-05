'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import { fetchAllOrders, updateOrderStatus } from '@/services/orderService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');
const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

function OrdersContent() {
  const queryClient = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ['orders', 'all'], queryFn: fetchAllOrders });

  const statusMut = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  return (
    <>
      <h2 className="font-display text-3xl mb-7">Orders</h2>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>{['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>)}</tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o._id}>
              <td className="p-3.5 text-sm border-b border-[#eee]">#{o._id.slice(-6).toUpperCase()}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{o.user?.email}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{fmt(o.totalPrice)}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">
                <select
                  defaultValue={o.status}
                  className="border border-[#ddd] text-[12.5px] px-2 py-1.5"
                  onChange={(e) => statusMut.mutate({ id: o._id, status: e.target.value })}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          )) || <tr><td colSpan={5} className="p-6 text-center text-muted">No orders yet</td></tr>}
        </tbody>
      </table>
    </>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrdersContent />
    </AdminLayout>
  );
}
