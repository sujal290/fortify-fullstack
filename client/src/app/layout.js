import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Fortify — Strength in Every Stitch',
  description: 'Premium bags and luggage by Shankar & Brothers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
