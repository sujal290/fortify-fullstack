import Spinner from '@/ui/Spinner';

// Shown automatically by Next.js while a route segment's data is loading.
export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <Spinner size={32} />
    </div>
  );
}
