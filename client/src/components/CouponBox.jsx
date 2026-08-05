'use client';
import { useState } from 'react';
import Button from '@/ui/Button';
import { validateCoupon } from '@/services/couponService';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

// Controlled by the parent (checkout page) so the applied discount can feed
// straight into the order total calculation there.
export default function CouponBox({ subtotal, applied, onApply, onRemove }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setPending(true);
    setError('');
    try {
      const result = await validateCoupon(code.trim(), subtotal);
      onApply({ code: result.code, discount: result.discount });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setPending(false);
    }
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-[#eaf6ee] border border-[#c8e6d0] px-4 py-3 text-[13px] text-[#215330]">
        <span><b>{applied.code}</b> applied — you saved {fmt(applied.discount)}</span>
        <button onClick={onRemove} className="text-[11px] uppercase underline">Remove</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 px-3.5 py-2.5 text-[13px] border border-[#ddd] outline-none focus:border-gold uppercase"
        />
        <Button type="button" variant="outline" size="sm" loading={pending} onClick={handleApply}>Apply</Button>
      </div>
      {error && <p className="text-[11.5px] text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
