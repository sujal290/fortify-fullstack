'use client';

const VARIANTS = {
  primary: 'bg-gold text-navy hover:bg-gold-light',
  dark: 'bg-navy text-cream hover:bg-[#1c2c42]',
  outline: 'bg-transparent border border-gold text-navy hover:bg-gold/10',
  ghost: 'bg-transparent text-navy hover:bg-black/5',
  danger: 'bg-transparent text-red-700 hover:bg-red-50',
};

const SIZES = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-7 py-3.5 text-xs',
  lg: 'px-9 py-4 text-[13px]',
};

/**
 * Base Button — every button in the app should use this rather than a raw
 * <button>, so variant/size/loading states stay consistent site-wide.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.12em]',
        'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </button>
  );
}

function Spinner({ size = 16 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}
