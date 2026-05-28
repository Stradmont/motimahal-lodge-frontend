import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Motimahal Lodge | Hotel Booking & Room Service',
  description:
    'Book comfortable Deluxe, Standard, and Normal rooms at Motimahal Lodge in Sauraha, Chitwan. Order fresh Nepali Thali & Momo directly to your room.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary-accent/30 selection:text-foreground">
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
