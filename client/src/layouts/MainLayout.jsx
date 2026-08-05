import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WishlistSync from '@/components/WishlistSync';

// Wraps every customer-facing page — shop, product, cart, checkout, story.
export default function MainLayout({ children }) {
  return (
    <>
      <WishlistSync />
      <div className="bg-navy text-cream text-center text-[11px] tracking-[0.12em] uppercase py-1.5">
        Complimentary shipping on orders over ₹4,000 · Lifetime hardware warranty
      </div>
      <Navbar />
      <main className="bg-cream min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
