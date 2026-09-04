'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative text-stone-200 py-16 sm:py-20 border-t border-[#2D4D3B] bg-[#14281E] overflow-hidden"
      style={{
        backgroundImage: "url('/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Lighter, natural dark green overlay so background texture and silhouette are easy to notice */}
      <div className="absolute inset-0 bg-[#16291E]/65 pointer-events-none" />

      {/* Skyline Silhouette SVG Footer Element Backdrop - Elevated Position */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 w-full pointer-events-none overflow-hidden select-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer-element.svg"
          alt=""
          className="w-full h-32 sm:h-44 md:h-52 object-cover object-top pointer-events-none opacity-90 brightness-110"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2D4D3B]/70 text-sm sm:text-base">

          {/* Brand Column with Logo (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Motimahal Lodge Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-full shadow-sm shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-white leading-tight">
                  Motimahal
                </span>
                <span className="text-xs text-[#C88A3B] font-semibold uppercase tracking-wider">
                  Lodge & Restaurant
                </span>
              </div>
            </Link>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-sm font-normal">
              A family-owned lodge in Bharatpur-10, Chitwan offering clean AC rooms, 24/7 hot solar showers, fresh tandoori grills, and warm Nepalese hospitality.
            </p>
          </div>

          {/* Navigation Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white tracking-wide border-b border-[#2D4D3B] pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2 text-stone-300 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-white transition-colors">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Stories & Blog
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Practical Info Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white tracking-wide border-b border-[#2D4D3B] pb-2 inline-block">
              Location & Details
            </h4>
            <ul className="space-y-3 text-stone-300 text-sm font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#C88A3B] shrink-0 mt-1" />
                <span>Bharatpur-10, Narayangarh, Chitwan, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#C88A3B] shrink-0" />
                <span>+977 98550 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C88A3B] shrink-0" />
                <span>info@motimahallodge.com</span>
              </li>
            </ul>
          </div>

          {/* Direct Contact Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white tracking-wide border-b border-[#2D4D3B] pb-2 inline-block">
              Front Desk Support
            </h4>
            <p className="text-stone-300 text-sm leading-relaxed font-normal">
              Our family front desk is available 24/7 for room inquiries, safari booking assistance, or travel directions.
            </p>
            <div className="pt-1">
              <a
                href="tel:+9779855012345"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F3A2B] hover:bg-[#162B20] border border-[#2D4D3B] text-white font-medium text-xs sm:text-sm rounded-md transition-colors shadow-xs"
              >
                <Phone className="h-4 w-4 text-[#C88A3B]" />
                <span>Call +977 98550 12345</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-400 text-xs sm:text-sm gap-2">
          <span>© {new Date().getFullYear()} Motimahal Lodge & Restaurant. All rights reserved.</span>
          <span>Bharatpur, Chitwan, Nepal</span>
        </div>
      </div>
    </footer>
  );
}
