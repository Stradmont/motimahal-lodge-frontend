import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Motimahal Lodge | Hotel Booking & Room Service",
  description: "Book comfortable Deluxe, Standard, and Normal rooms at Motimahal Lodge in Sauraha, Chitwan. Order fresh Nepali Thali & Momo directly to your room.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary-accent/30 selection:text-foreground">
        <AppProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
