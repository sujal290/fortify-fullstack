// PATH: client/src/app/admin/products/page.js  (REPLACES existing file)
'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/ui/Button';
import Badge from '@/ui/Badge';
import ProductFormModal from '@/components/ProductFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { fetchProducts, createProduct, updateProduct, deleteProduct, restoreProduct } from '@/services/productService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function ProductsContent() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteModal = useModal();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [tab, setTab] = useState('active'); // 'active' | 'archived'

  // admin:true always, so deactivated (isActive:false) products still show here.
  // trash:true switches to the archived (soft-deleted) view.
  const { data } = useQuery({
    queryKey: ['products', 'admin', tab],
    queryFn: () => fetchProducts({ limit: 100, admin: 'true', trash: tab === 'archived' ? 'true' : undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { invalidate(); showToast('Product added'); formModal.closeModal(); },
    onError: (err) => showToast(err?.response?.data?.message || 'Could not add product', 'error'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => { invalidate(); showToast('Product updated'); formModal.closeModal(); },
    onError: (err) => showToast(err?.response?.data?.message || 'Could not update product', 'error'),
  });
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { invalidate(); showToast('Product archived'); },
  });
  const restoreMut = useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => { invalidate(); showToast('Product restored'); },
  });
  const toggleActiveMut = useMutation({
    mutationFn: ({ id, isActive }) => updateProduct(id, { isActive }),
    onSuccess: () => { invalidate(); showToast('Product status updated'); },
  });

  const openAdd = () => { setEditing(null); formModal.openModal(); };
  const openEdit = (p) => { setEditing(p); formModal.openModal(); };
  const handleSubmit = (values) => {
    if (editing) updateMut.mutate({ id: editing._id, data: values });
    else createMut.mutate(values);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-3xl">Products</h2>
        <Button variant="primary" onClick={openAdd}>+ Add Product</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-2 text-[11px] uppercase tracking-[0.08em] border ${tab === 'active' ? 'bg-navy text-cream border-navy' : 'border-[#ddd] text-navy'}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`px-4 py-2 text-[11px] uppercase tracking-[0.08em] border ${tab === 'archived' ? 'bg-navy text-cream border-navy' : 'border-[#ddd] text-navy'}`}
        >
          Archived
        </button>
      </div>

      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>{['Name', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>)}</tr>
        </thead>
        <tbody>
          {data?.products?.map((p) => (
            <tr key={p._id}>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.name}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.category}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{fmt(p.price)}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.stock}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">
                {tab === 'archived' ? (
                  <Badge tone="Cancelled">Archived</Badge>
                ) : (
                  <button onClick={() => toggleActiveMut.mutate({ id: p._id, isActive: !p.isActive })}>
                    <Badge tone={p.isActive ? 'Confirmed' : 'Cancelled'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                  </button>
                )}
              </td>
              <td className="p-3.5 text-sm border-b border-[#eee]">
                {tab === 'archived' ? (
                  <button className="text-navy hover:text-gold px-2 text-xs" onClick={() => restoreMut.mutate(p._id)}>Restore</button>
                ) : (
                  <>
                    <button className="text-navy hover:text-gold px-2 text-xs" onClick={() => openEdit(p)}>Edit</button>
                    <button className="text-red-700 hover:text-red-900 px-2 text-xs" onClick={() => { setDeletingId(p._id); deleteModal.openModal(); }}>Archive</button>
                  </>
                )}
              </td>
            </tr>
          )) || (
            <tr><td colSpan={6} className="p-6 text-center text-muted">{tab === 'archived' ? 'Nothing archived.' : 'No products yet.'}</td></tr>
          )}
        </tbody>
      </table>

      <ProductFormModal
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
        title="Archive this product?"
        description="It'll be hidden from the storefront but can be restored anytime from the Archived tab."
        confirmLabel="Archive"
      />
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductsContent />
    </AdminLayout>
  );
}