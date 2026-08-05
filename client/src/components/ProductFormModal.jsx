'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/ui/Modal';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';
import { CATEGORIES } from '@/constants/categories';

// Shared Add/Edit form for the admin product CRUD screen.
export default function ProductFormModal({ open, onClose, onSubmit, editing, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) reset(editing || { category: CATEGORIES[0].name, stock: 10 });
  }, [open, editing, reset]);

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Product Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <div className="grid grid-cols-2 gap-3.5">
          <Select label="Category" options={CATEGORIES.map((c) => c.name)} {...register('category')} />
          <Input label="Stock" type="number" min={0} error={errors.stock?.message} {...register('stock', { required: true, valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Input label="Price (₹)" type="number" min={0} error={errors.price?.message} {...register('price', { required: true, valueAsNumber: true })} />
          <Input label="MRP (₹)" type="number" min={0} error={errors.mrp?.message} {...register('mrp', { required: true, valueAsNumber: true })} />
        </div>
        <div className="mb-4">
          <label className="block text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-1.5">Description</label>
          <textarea rows={3} className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#fbfbfa] border border-[#ddd] outline-none focus:border-gold" {...register('description', { required: true })} />
        </div>
        <div className="flex gap-3 mt-5">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={submitting}>{editing ? 'Save Changes' : 'Add Product'}</Button>
        </div>
      </form>
    </Modal>
  );
}
