'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { getMe } from '@/services/authService';
import Spinner from '@/ui/Spinner';

// The server's Google OAuth callback redirects here with ?token=... —
// this page stores the token, fetches the profile, then bounces home.
function CallbackHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return router.replace('/login');
    localStorage.setItem('fortify_token', token);
    getMe().then((user) => {
      dispatch(setCredentials({ ...user, token }));
      router.replace('/');
    }).catch(() => router.replace('/login'));
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <Spinner size={32} />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}
