'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import BookingModal from './BookingModal';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Rooms', href: '/rooms' },
  { label: 'Dining', href: '/food' },
  { label: 'Attractions', href: '/attractions' },
  { label: 'Guest Reviews', href: '/reviews' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Stories', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Header Overlay matching Panorama Lodge Header */}
      <header className="absolute top-0 left-0 right-0 z-40 w-full bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white py-4 sm:py-6 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Brand Logo with actual logo.png */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Motimahal Lodge Logo"
              className="h-10 sm:h-12 w-auto object-contain "
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-xl sm:text-2xl font-bold  text-white leading-tight">
                MOTIMAHAL
              </span>
              <span className="text-xs text-white/80 font-medium">
                Lodge & Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Right Navigation: Book Now outlined pill button + Menu Drawer Toggle */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wider text-white/90">
              {NAV_ITEMS.slice(0, 5).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-colors hover:text-white ${
                    isActive(item.href) ? 'text-white border-b-2 border-white pb-0.5' : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="border border-white/80 hover:bg-white hover:text-stone-900 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer tracking-wider"
            >
              Book Now
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-white hover:text-stone-200 transition-colors cursor-pointer"
              aria-label="Toggle Menu Drawer"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>

          {/* Mobile Right: Book Now + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="border border-white/80 text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>

        </div>

        {/* Full Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#1A1918] text-white p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Motimahal Lodge" className="h-10 w-auto brightness-0 invert" />
                <span className="font-heading text-xl sm:text-2xl font-bold">MOTIMAHAL LODGE</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/80 hover:text-white">
                <X className="h-7 w-7" />
              </button>
            </div>

            <nav className="py-8 space-y-4 text-center sm:text-left">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-heading text-2xl sm:text-3xl font-bold transition-colors ${
                    isActive(item.href) ? 'text-[#C88A3B]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-6 space-y-4 text-xs sm:text-sm text-white/70">
              <div>
                <span className="block font-bold text-white uppercase tracking-wider mb-1">Motimahal Lodge & Restaurant</span>
                <p>Bharatpur-10, Chitwan District, Nepal</p>
                <p>Front Desk: +977 98550 12345</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBookingModalOpen(true);
                }}
                className="w-full bg-[#1F3A2B] text-white font-semibold py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider"
              >
                Check Availability & Book
              </button>
            </div>
          </div>
        )}
      </header>

      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </>
  );
}
