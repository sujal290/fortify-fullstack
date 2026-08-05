'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_LINKS } from '@/constants/navLinks';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-screen">
      <aside className="bg-navy text-cream py-8">
        <div className="px-6 pb-5 mb-3 border-b border-white/10">
          <b className="block text-sm">{user?.name}</b>
          <span className="text-[11px] text-gold-light">Proprietor · Admin</span>
        </div>
        <nav className="flex flex-col">
          {ADMIN_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 px-6 py-3 text-[12.5px] border-l-[3px] ${
                pathname === l.href ? 'border-gold bg-gold/10 text-cream' : 'border-transparent text-[#c9d0d9] hover:bg-white/5'
              }`}
            >
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
          <Link href="/" className="px-6 py-3 mt-4 text-[12.5px] text-[#c9d0d9] border-t border-white/10 pt-4">← Back to Site</Link>
          <button onClick={logout} className="px-6 py-3 text-left text-[12.5px] text-[#c9d0d9]">Sign out</button>
        </nav>
      </aside>
      <main className="bg-[#fcfbf9] p-9">{children}</main>
    </div>
  );
}

// Every /admin/* page should wrap its content in <AdminLayout>...</AdminLayout>
export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
