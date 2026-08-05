// PATH: client/src/components/Navbar.jsx  (REPLACES existing file)
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_LINKS } from '@/constants/navLinks';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <header className="bg-navy sticky top-0 z-50 border-b border-gold/25">
      <div className="max-w-6xl mx-auto px-7 flex items-center justify-between py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex flex-col items-center text-cream leading-none">
            <span className="font-display text-2xl tracking-[0.22em] font-semibold">FORTIFY</span>
            <span className="text-[8px] tracking-[0.25em] text-gold-light mt-1 uppercase">Strength in every stitch</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-xs tracking-[0.08em] uppercase">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-cream/85 pb-1 border-b ${pathname === l.href ? 'border-gold opacity-100' : 'border-transparent hover:opacity-100'}`}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-cream/85 pb-1 border-b border-transparent hover:opacity-100">Admin</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="hidden sm:flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Search Fortify…"
                className="bg-transparent border-b border-gold text-cream text-[13px] placeholder:text-cream/40 outline-none w-48 py-1"
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="hidden sm:inline text-cream text-[13px]" aria-label="Search">🔍</button>
          )}
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" className="text-cream text-[13px]" aria-label="Wishlist">♡</Link>
              <Link href="/orders" className="text-cream text-[13px] hidden sm:inline">👤 {user?.name?.split(' ')[0]}</Link>
              <button onClick={logout} className="text-cream text-[13px] hidden sm:inline">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="text-cream text-[13px]">Sign in</Link>
          )}
          <Link href="/cart" className="relative text-cream text-[13px]">
            🛍 Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-gold text-navy text-[10px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden text-cream" onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</button>
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}