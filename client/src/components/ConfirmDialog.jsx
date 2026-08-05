'use client';
import Modal from '@/ui/Modal';
import Button from '@/ui/Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmLabel = 'Confirm' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {description && <p className="text-[13.5px] text-muted mb-6">{description}</p>}
      <div className="flex gap-3">
        <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        <Button variant="dark" fullWidth onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
