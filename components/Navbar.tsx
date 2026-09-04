'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import BookingModal from './BookingModal';

const DRAWER_NAV_ITEMS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'ROOMS & ACCOMMODATION', href: '/rooms' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'STORIES & BLOG', href: '/blog' },
  { label: 'GUEST REVIEWS', href: '/reviews' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) < 8) return;

      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (diff > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Modern Boutique Hospitality Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-[#162B20]/95 backdrop-blur-md border-b border-[#2D4D3B]/40 py-3.5 sm:py-4 px-4 sm:px-8 lg:px-12 shadow-sm text-white'
            : 'bg-transparent text-white py-5 sm:py-6 px-4 sm:px-8 lg:px-12'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LEFT: Brand Logo & Title Anchor */}
          <Link href="/" className="flex items-center gap-3.5 cursor-pointer group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Motimahal Lodge Logo"
              className="h-11 sm:h-13 w-auto object-contain rounded-full shadow-xs"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-xs tracking-wide">
                MOTIMAHAL
              </span>
              <span className="text-xs sm:text-sm text-white/95 font-semibold tracking-[0.18em] uppercase drop-shadow-xs">
                Lodge & Restaurant
              </span>
            </div>
          </Link>

          {/* RIGHT: Location + Phone + Book Now CTA + Hamburger Menu Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Location Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-white/90 font-medium tracking-wide drop-shadow-xs">
              <MapPin className="h-4 w-4 text-[#C88A3B] shrink-0" />
              <span>Chitwan, Nepal</span>
            </div>

            {/* Phone Contact Option */}
            <a
              href="tel:+9779855012345"
              className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white transition-colors drop-shadow-xs"
            >
              <Phone className="h-4 w-4 text-[#C88A3B] shrink-0" />
              <span>+977 98550 12345</span>
            </a>

            {/* Refined Book Now Button */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-md transition-all cursor-pointer tracking-wider uppercase shadow-xs"
              style={{
                backgroundImage: "linear-gradient(rgba(31, 58, 43, 0.88), rgba(31, 58, 43, 0.88)), url('/backs.png')",
                backgroundRepeat: 'repeat',
              }}
            >
              Book Now
            </button>

            {/* Hamburger Menu Toggle (Positioned on the Right) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 text-white hover:text-stone-200 transition-colors cursor-pointer group border-l border-white/20 pl-3 sm:pl-5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-white/95">
                Menu
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* Side Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          
          {/* Backdrop Click to Close */}
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content Container with backs.png Texture */}
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-[#FAF7F2] text-[#2D2B2A] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-[#E6DFD5]"
            style={{
              backgroundImage: "url('/backs.png')",
              backgroundRepeat: 'repeat',
            }}
          >
            
            {/* Drawer Header with Logo & Close Button */}
            <div className="p-6 sm:p-8 border-b border-[#E6DFD5] flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Motimahal Lodge"
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-heading text-lg font-bold text-[#2D2B2A] tracking-wider uppercase leading-tight">
                    MOTIMAHAL
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold tracking-widest uppercase">
                    LODGE AND RESTAURANT
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                aria-label="Close menu drawer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links List */}
            <nav className="p-6 sm:p-8 space-y-5 flex-1">
              {DRAWER_NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block font-heading text-base sm:text-lg font-bold uppercase tracking-wider transition-colors ${
                      active ? 'text-[#1F3A2B]' : 'text-[#2D2B2A] hover:text-[#1F3A2B]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Callout */}
            <div className="p-6 sm:p-8 border-t border-[#E6DFD5]">
              <a
                href="tel:+9779855012345"
                className="flex items-center gap-4 group transition-colors"
              >
                <Phone className="h-8 w-8 text-[#1F3A2B] shrink-0 group-hover:scale-105 transition-transform" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block">
                    INFO AND BOOKINGS
                  </span>
                  <span className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A2B] tracking-wide block">
                    +977 98550 12345
                  </span>
                </div>
              </a>
            </div>

          </div>
        </div>
      )}

      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </>
  );
}
