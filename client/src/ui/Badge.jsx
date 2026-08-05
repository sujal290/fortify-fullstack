// PATH: client/src/ui/Badge.jsx  (REPLACES existing file)
const STATUS_STYLES = {
  Pending: 'bg-[#fdf1e0] text-[#a5680c]',
  Confirmed: 'bg-[#e5f0ea] text-[#1f6b40]',
  Shipped: 'bg-[#e6eefc] text-[#1f4c8b]',
  'Out for Delivery': 'bg-[#eee6fb] text-[#5b2f9e]',
  Delivered: 'bg-[#e5f0ea] text-[#1f6b40]',
  Cancelled: 'bg-[#fbecec] text-[#7a1f1f]',
};

export default function Badge({ children, tone }) {
  const style = STATUS_STYLES[tone] || STATUS_STYLES[children] || 'bg-cream text-muted';
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] rounded-sm ${style}`}>
      {children}
    </span>
  );
}