// PATH: client/src/ui/Select.jsx  (REPLACES existing file)
'use client';
import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, id, options = [], className = '', ...props }, ref) {
  const selectId = id || props.name;
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={selectId} className="block text-[10.5px] tracking-[0.08em] uppercase text-navy font-semibold mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={['w-full px-3.5 py-2.5 text-[13.5px] font-body bg-[#fbfbfa] border border-[#ddd] outline-none focus:border-gold', className].join(' ')}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const text = typeof opt === 'object' ? opt.label : opt;
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
    </div>
  );
});

export default Select;