import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MarketPulse AI',
  description: 'Real-time Indian stock market signals'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
