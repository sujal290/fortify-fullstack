import Link from 'next/link';
import Button from '@/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col items-center justify-center text-center px-6">
      <span className="font-display text-8xl text-gold-light mb-3">404</span>
      <h1 className="font-display text-3xl mb-3">This page wandered off.</h1>
      <p className="text-[#c9d0d9] text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link href="/"><Button variant="primary">Back to Home</Button></Link>
    </div>
  );
}
