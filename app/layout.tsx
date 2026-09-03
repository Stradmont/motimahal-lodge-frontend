import type { Metadata } from 'next';
import { Mirza, Jost } from 'next/font/google';
import './globals.css';

const mirza = Mirza({
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Motimahal Lodge & Restaurant | Bharatpur, Chitwan, Nepal',
  description:
    'Experience luxury lodge accommodations, authentic Chitwan hospitality, and mouthwatering tandoori cuisine near the Narayani River and Chitwan National Park.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mirza.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-[#333333] font-sans selection:bg-[#EAB308]/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
