'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/ui/Spinner';

// Wrap any page that requires auth (and optionally admin role):
//   <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
    else if (adminOnly && !isAdmin) router.replace('/');
  }, [isAuthenticated, isAdmin, adminOnly, router]);

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner />
      </div>
    );
  }

  return children;
}
