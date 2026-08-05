'use client';
import { useState } from 'react';
import Button from '@/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Subscribed — welcome to the list');
    setEmail('');
  };

  return (
    <section className="bg-white border-t border-[#eee] py-16">
      <div className="max-w-xl mx-auto px-7 text-center">
        <h3 className="font-display text-3xl font-semibold mb-2">Join the list</h3>
        <p className="text-muted text-sm mb-6">New arrivals and early access to seasonal drops — no spam.</p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 border border-[#ddd] text-sm outline-none focus:border-gold"
          />
          <Button type="submit" variant="dark">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
