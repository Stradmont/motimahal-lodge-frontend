import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Motimahal Lodge & Restaurant | Bharatpur, Chitwan',
  description:
    'Welcome to Motimahal Lodge & Restaurant in Bharatpur, Chitwan. Experience warm family hospitality, comfortable rooms, and authentic tandoori cuisine near the beautiful Narayani River.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary-accent/30 selection:text-foreground">
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
