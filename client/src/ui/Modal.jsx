'use client';
import { useEffect } from 'react';

/**
 * Base modal — used directly, or composed into ConfirmDialog / product forms.
 * Closes on Escape and on backdrop click.
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-navy/55 flex items-center justify-center z-[200] p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white w-full ${maxWidth} p-8 max-h-[88vh] overflow-auto`}>
        {title && <h3 className="font-display text-2xl mb-5">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
