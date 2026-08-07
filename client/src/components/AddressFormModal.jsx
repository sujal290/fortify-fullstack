// PATH: client/src/components/AddressFormModal.jsx  (NEW FILE)
'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/ui/Modal';
import Input from '@/ui/Input';
import Button from '@/ui/Button';

export default function AddressFormModal({ open, onClose, onSubmit, editing, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) reset(editing || { label: 'Home' });
  }, [open, editing, reset]);

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Address' : 'Add Address'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Label (e.g. Home, Office)" {...register('label')} />
        <div className="grid grid-cols-2 gap-3.5">
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName', { required: 'Required' })} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
        </div>
        <Input label="Address Line" error={errors.line1?.message} {...register('line1', { required: 'Required' })} />
        <div className="grid grid-cols-3 gap-3.5">
          <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
          <Input label="State" {...register('state')} />
          <Input label="PIN Code" error={errors.pin?.message} {...register('pin', { required: 'Required' })} />
        </div>
        <label className="flex items-center gap-2 text-[12.5px] mb-4">
          <input type="checkbox" {...register('isDefault')} /> Set as default address
        </label>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={submitting}>{editing ? 'Save Changes' : 'Add Address'}</Button>
        </div>
      </form>
    </Modal>
  );
}