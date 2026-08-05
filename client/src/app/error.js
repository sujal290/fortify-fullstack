'use client';
import { useEffect } from 'react';
import Button from '@/ui/Button';

// App Router error boundary — catches render/runtime errors in any page
// beneath it and shows a graceful fallback instead of a blank white screen.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-6">
      <span className="text-5xl mb-4">⚠️</span>
      <h1 className="font-display text-2xl mb-2.5 text-navy">Something went wrong.</h1>
      <p className="text-muted text-sm mb-7 max-w-sm">
        An unexpected error occurred while loading this page.
      </p>
      <Button variant="dark" onClick={reset}>Try Again</Button>
    </div>
  );
}
