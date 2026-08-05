'use client';
import { forwardRef } from 'react';

/**
 * Labeled text input with the Fortify form styling + error state.
 * Works uncontrolled with react-hook-form via ref forwarding.
 */
const Input = forwardRef(function Input({ label, error, id, className = '', ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={[
          'w-full px-3.5 py-2.5 text-[13.5px] font-body bg-[#fbfbfa] border',
          error ? 'border-red-400' : 'border-[#ddd] focus:border-gold',
          'outline-none transition-colors',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1.5 text-[11.5px] text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
