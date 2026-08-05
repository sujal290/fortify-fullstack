'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/ui/Modal';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import Button from '@/ui/Button';

export default function CouponFormModal({ open, onClose, onSubmit, editing, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? { ...editing, expiresAt: editing.expiresAt ? editing.expiresAt.slice(0, 10) : '' }
          : { type: 'flat', value: 0, minOrderValue: 0, usageLimit: 0, isActive: true }
      );
    }
  }, [open, editing, reset]);

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Coupon Code" error={errors.code?.message} {...register('code', { required: 'Required' })} />
        <div className="grid grid-cols-2 gap-3.5">
          <Select label="Type" options={['flat', 'percentage']} {...register('type')} />
          <Input label="Value" type="number" min={0} error={errors.value?.message} {...register('value', { required: true, valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Input label="Min Order Value (₹)" type="number" min={0} {...register('minOrderValue', { valueAsNumber: true })} />
          <Input label="Usage Limit (0 = unlimited)" type="number" min={0} {...register('usageLimit', { valueAsNumber: true })} />
        </div>
        <Input label="Expires On (optional)" type="date" {...register('expiresAt')} />
        <label className="flex items-center gap-2 text-[12.5px] mb-4">
          <input type="checkbox" {...register('isActive')} /> Active
        </label>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={submitting}>{editing ? 'Save Changes' : 'Add Coupon'}</Button>
        </div>
      </form>
    </Modal>
  );
}
