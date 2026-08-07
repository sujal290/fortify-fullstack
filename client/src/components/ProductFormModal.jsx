// PATH: client/src/components/ProductFormModal.jsx  (REPLACES existing file)
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/ui/Modal';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';
import Spinner from '@/ui/Spinner';
import { CATEGORIES } from '@/constants/categories';
import { uploadImage } from '@/services/uploadService';
import { useToast } from '@/hooks/useToast';

// Shared Add/Edit form for the admin product CRUD screen.
export default function ProductFormModal({ open, onClose, onSubmit, editing, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const [images, setImages] = useState([]); // [{ url, publicId }]
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? { ...editing, tags: (editing.tags || []).join(', ') }
          : {
              category: CATEGORIES[0].name,
              stock: 10,
              isActive: true,
              isFeatured: false,
              isNewArrival: false,
              isBestSeller: false,
              weight: 0,
              dimensions: { length: 0, width: 0, height: 0 },
            }
      );
      setImages(editing?.images || []);
    }
  }, [open, editing, reset]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setImages((prev) => [...prev, result]);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (publicId) => setImages((prev) => prev.filter((img) => img.publicId !== publicId));

  const submit = (data) => {
    const tags = (data.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      ...data,
      images,
      tags,
      dimensions: {
        length: Number(data.dimensions?.length) || 0,
        width: Number(data.dimensions?.width) || 0,
        height: Number(data.dimensions?.height) || 0,
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Product' : 'Add Product'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(submit)}>
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

        {/* --- Catalog details --- */}
        <div className="grid grid-cols-2 gap-3.5">
          <Input label="SKU (optional)" placeholder="e.g. FRT-BP-001" {...register('sku')} />
          <Input label="Tags (comma-separated)" placeholder="leather, weekend, travel" {...register('tags')} />
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <Input label="Material" {...register('material')} />
          <Input label="Color" {...register('color')} />
          <Input label="Weight (kg)" type="number" min={0} step="0.01" {...register('weight', { valueAsNumber: true })} />
        </div>
        <div className="mb-1.5">
          <label className="block text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-1.5">Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-3.5">
            <Input placeholder="Length" type="number" min={0} {...register('dimensions.length', { valueAsNumber: true })} />
            <Input placeholder="Width" type="number" min={0} {...register('dimensions.width', { valueAsNumber: true })} />
            <Input placeholder="Height" type="number" min={0} {...register('dimensions.height', { valueAsNumber: true })} />
          </div>
        </div>

        {/* --- Flags --- */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5 mt-3 p-3.5 bg-[#fbfbfa] border border-[#eee]">
          <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" {...register('isActive')} /> Active (visible on storefront)</label>
          <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" {...register('isFeatured')} /> Featured</label>
          <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" {...register('isNewArrival')} /> New Arrival</label>
          <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" {...register('isBestSeller')} /> Best Seller</label>
        </div>

        <div className="mb-5">
          <label className="block text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-1.5">Product Images</label>
          <div className="flex flex-wrap gap-2.5 mb-2.5">
            {images.map((img) => (
              <div key={img.publicId} className="relative w-16 h-16 border border-[#eee]">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.publicId)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-navy text-cream text-[10px] rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {uploading && <div className="w-16 h-16 border border-[#eee] flex items-center justify-center"><Spinner size={18} /></div>}
          </div>
          <label className="inline-block text-[11px] uppercase tracking-[0.05em] text-navy border border-[#ddd] px-3 py-2 cursor-pointer hover:border-gold">
            + Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          <p className="text-[11px] text-muted mt-1.5">Uploads to Cloudinary — requires CLOUDINARY_* keys set on the server.</p>
        </div>

        <div className="flex gap-3 mt-5">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={submitting}>{editing ? 'Save Changes' : 'Add Product'}</Button>
        </div>
      </form>
    </Modal>
  );
}