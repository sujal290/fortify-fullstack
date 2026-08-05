'use client';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants/navLinks';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-navy z-[100] flex flex-col p-8" role="dialog" aria-modal="true">
      <button onClick={onClose} className="self-end text-cream text-2xl mb-8" aria-label="Close menu">✕</button>
      <nav className="flex flex-col gap-6">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={onClose} className="text-cream font-display text-3xl">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
