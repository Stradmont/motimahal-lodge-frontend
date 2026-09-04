'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Phone, MapPin } from 'lucide-react';
import MobileNavDrawer, { NavItem } from './MobileNavDrawer';
import { useContactSettings } from '@/lib/contact-settings';

const DRAWER_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Rooms & Accommodation', href: '/rooms' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Stories & Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const contact = useContactSettings();

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled
            ? 'bg-brand-green-dark/95 backdrop-blur-md border-b border-footer-border/40 py-3.5 sm:py-4 px-4 sm:px-8 lg:px-12 shadow-sm text-white'
            : 'bg-transparent text-white py-5 sm:py-6 px-4 sm:px-8 lg:px-12'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* LEFT: Brand Logo & Title Anchor */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/logo.png"
              alt="Motimahal Lodge Logo"
              className="h-11 sm:h-12 w-auto object-contain rounded-full shadow-xs"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                Motimahal
              </span>
              <span className="text-xs text-white/90 font-medium">
                Lodge & Restaurant
              </span>
            </div>
          </Link>

          {/* RIGHT: Location + Phone + Book Stay Link + Hamburger Menu Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Location Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-white/90 font-medium">
              <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
              <span>{contact.address.split(',')[0]}</span>
            </div>

            {/* Phone Contact Option */}
            <a
              href={`tel:${contact.primaryPhone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/95 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4 text-brand-gold shrink-0" />
              <span>{contact.primaryPhone}</span>
            </a>

            {/* Refined Book Stay Link */}
            <Link
              href="/contact"
              className="bg-transparent hover:bg-brand-green-dark border border-white text-white font-medium text-xs sm:text-sm px-5 py-2 rounded-md transition-all cursor-pointer shadow-xs"
            >
              Book Stay
            </Link>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 text-white hover:text-stone-200 transition-colors cursor-pointer group border-l border-white/20 pl-3 sm:pl-5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-105 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Standalone Mobile Navigation Drawer Component */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={DRAWER_NAV_ITEMS}
      />
    </>
  );
}
