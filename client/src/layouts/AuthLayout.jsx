import Link from 'next/link';

// Centered card shell for login / signup / forgot-password pages.
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="text-center py-8">
        <Link href="/" className="font-display text-2xl tracking-[0.22em] text-navy font-semibold">FORTIFY</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-[420px] bg-white border border-[#eee] p-11 shadow-[0_30px_60px_-30px_rgba(15,27,42,0.25)]">
          {children}
        </div>
      </div>
    </div>
  );
}
