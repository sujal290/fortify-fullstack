// PATH: client/src/components/AddressBook.jsx  (NEW FILE)
'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddressFormModal from './AddressFormModal';
import ConfirmDialog from './ConfirmDialog';
import Button from '@/ui/Button';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/services/userService';

/**
 * Shows the logged-in user's saved addresses with add/edit/delete/set-default.
 * Pass `selectedId` + `onSelect` to turn it into a picker (used at checkout);
 * omit them to get a plain management view (used on the addresses page).
 */
export default function AddressBook({ selectedId, onSelect }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteModal = useModal();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: addresses, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['addresses'] });

  const addMut = useMutation({
    mutationFn: addAddress,
    onSuccess: (list) => { invalidate(); showToast('Address added'); formModal.closeModal(); onSelect?.(list[list.length - 1]._id); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: () => { invalidate(); showToast('Address updated'); formModal.closeModal(); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => { invalidate(); showToast('Address removed'); },
  });
  const defaultMut = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => { invalidate(); showToast('Default address updated'); },
  });

  const openAdd = () => { setEditing(null); formModal.openModal(); };
  const openEdit = (a) => { setEditing(a); formModal.openModal(); };
  const handleSubmit = (values) => {
    if (editing) updateMut.mutate({ id: editing._id, data: values });
    else addMut.mutate(values);
  };

  if (isLoading) return <p className="text-[13px] text-muted">Loading addresses…</p>;

  return (
    <div>
      {addresses?.length === 0 && <p className="text-[13px] text-muted mb-4">No saved addresses yet.</p>}

      <div className="space-y-3 mb-4">
        {addresses?.map((a) => (
          <div
            key={a._id}
            onClick={() => onSelect?.(a._id)}
            className={[
              'border p-4 text-[13px] leading-relaxed',
              onSelect ? 'cursor-pointer' : '',
              selectedId === a._id ? 'border-gold bg-[#faf3ea]' : 'border-[#eee] bg-white',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                {onSelect && (
                  <input type="radio" checked={selectedId === a._id} onChange={() => onSelect(a._id)} className="mt-1" />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <b className="text-navy">{a.label || 'Address'}</b>
                    {a.isDefault && <span className="text-[10px] uppercase tracking-[0.05em] bg-gold/20 text-[#8a5f2e] px-1.5 py-0.5">Default</span>}
                  </div>
                  <div className="text-muted">
                    {a.fullName} · {a.phone}<br />
                    {a.line1}, {a.city}{a.state ? `, ${a.state}` : ''} — {a.pin}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-[11px] uppercase tracking-[0.05em] shrink-0">
                {!a.isDefault && (
                  <button onClick={(e) => { e.stopPropagation(); defaultMut.mutate(a._id); }} className="text-navy hover:text-gold">Set Default</button>
                )}
                <button onClick={(e) => { e.stopPropagation(); openEdit(a); }} className="text-navy hover:text-gold">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); setDeletingId(a._id); deleteModal.openModal(); }} className="text-red-700 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={openAdd}>+ Add New Address</Button>

      <AddressFormModal
        open={formModal.open}
        onClose={formModal.closeModal}
        onSubmit={handleSubmit}
        editing={editing}
        submitting={addMut.isPending || updateMut.isPending}
      />
      <ConfirmDialog
        open={deleteModal.open}
        onClose={deleteModal.closeModal}
        onConfirm={() => deleteMut.mutate(deletingId)}
        title="Remove this address?"
        confirmLabel="Delete"
      />
    </div>
  );
}