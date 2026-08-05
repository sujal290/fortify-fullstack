'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/ui/Button';
import ProductFormModal from '@/components/ProductFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function ProductsContent() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteModal = useModal();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data } = useQuery({ queryKey: ['products', 'admin'], queryFn: () => fetchProducts({ limit: 100 }) });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { invalidate(); showToast('Product added'); formModal.closeModal(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => { invalidate(); showToast('Product updated'); formModal.closeModal(); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { invalidate(); showToast('Product removed'); },
  });

  const openAdd = () => { setEditing(null); formModal.openModal(); };
  const openEdit = (p) => { setEditing(p); formModal.openModal(); };
  const handleSubmit = (values) => {
    if (editing) updateMut.mutate({ id: editing._id, data: values });
    else createMut.mutate(values);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h2 className="font-display text-3xl">Products</h2>
        <Button variant="primary" onClick={openAdd}>+ Add Product</Button>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>{['Name', 'Category', 'Price', 'Stock', ''].map((h) => <th key={h} className="text-left text-[10.5px] tracking-[0.08em] uppercase text-muted p-3 border-b-2 border-navy">{h}</th>)}</tr>
        </thead>
        <tbody>
          {data?.products?.map((p) => (
            <tr key={p._id}>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.name}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.category}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{fmt(p.price)}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">{p.stock}</td>
              <td className="p-3.5 text-sm border-b border-[#eee]">
                <button className="text-navy hover:text-gold px-2 text-xs" onClick={() => openEdit(p)}>Edit</button>
                <button className="text-red-700 hover:text-red-900 px-2 text-xs" onClick={() => { setDeletingId(p._id); deleteModal.openModal(); }}>Delete</button>
              </td>
            </tr>
          ))}
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
        title="Remove this product?"
        description="This can't be undone."
        confirmLabel="Delete"
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
