'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/ui/Button';
import Badge from '@/ui/Badge';
import CouponFormModal from '@/components/CouponFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/couponService';

function CouponsContent() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteModal = useModal();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: coupons } = useQuery({ queryKey: ['coupons'], queryFn: fetchCoupons });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['coupons'] });

  const createMut = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => { invalidate(); showToast('Coupon added'); formModal.closeModal(); },
    onError: (err) => showToast(err?.response?.data?.message || 'Could not add coupon', 'error'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateCoupon(id, data),
    onSuccess: () => { invalidate(); showToast('Coupon updated'); formModal.closeModal(); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => { invalidate(); showToast('Coupon removed'); },
  });

  const openAdd = () => { setEditing(null); formModal.openModal(); };
  const openEdit = (c) => { setEditing(c); formModal.openModal(); };
  const handleSubmit = (values) => {
    if (editing) updateMut.mutate({ id: editing._id, data: values });
    else createMut.mutate(values);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h2 className="font-display text-3xl">Coupons</h2>
        <Button variant="primary" onClick={openAdd}>+ Add Coupon</Button>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>{['Code', 'Type', 'Value', 'Min Order', 'Used', 'Status', ''].map((h) => <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>)}</tr>
        </thead>
        <tbody>
          {coupons?.map((c) => (
            <tr key={c._id}>
              <td className="p-3.5 text-sm border-b border-[#eee] font-semibold">{c.code}</td>
              <td className="p-3.5 text-sm border-b border-[#eee] capitalize">{c.type}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{c.type === 'flat' ? `₹${c.value}` : `${c.value}%`}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">₹{c.minOrderValue}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{c.usedCount}{c.usageLimit > 0 ? ` / ${c.usageLimit}` : ''}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]"><Badge tone={c.isActive ? 'Confirmed' : 'Cancelled'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></td>
              <td className="p-3.5 text-sm border-b border-[#eee]">
                <button className="text-navy hover:text-gold px-2 text-xs" onClick={() => openEdit(c)}>Edit</button>
                <button className="text-red-700 hover:text-red-900 px-2 text-xs" onClick={() => { setDeletingId(c._id); deleteModal.openModal(); }}>Delete</button>
              </td>
            </tr>
          )) || <tr><td colSpan={7} className="p-6 text-center text-muted">No coupons yet</td></tr>}
        </tbody>
      </table>

      <CouponFormModal
        open={formModal.open}
        onClose={formModal.closeModal}
        onSubmit={handleSubmit}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
      />
      <ConfirmDialog
        open={deleteModal.open}
        onClose={deleteModal.closeModal}
        onConfirm={() => deleteMut.mutate(deletingId)}
        title="Remove this coupon?"
        confirmLabel="Delete"
      />
    </>
  );
}

export default function AdminCouponsPage() {
  return (
    <AdminLayout>
      <CouponsContent />
    </AdminLayout>
  );
}
