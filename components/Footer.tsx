'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative text-stone-200 py-16 sm:py-20 border-t border-[#2D4D3B] overflow-hidden bg-[#162B20]"
      style={{
        backgroundImage: "url('/backs-2.png')",
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Background SVG Pattern Accent */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-right-bottom opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/footer-element.svg')",
          backgroundSize: '360px auto',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-700/50 text-sm sm:text-base">

          {/* Brand Column (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold text-white block tracking-wide">
                MOTIMAHAL LODGE
              </span>
              <span className="text-xs text-stone-300 font-medium tracking-wider uppercase">
                & TANDOORI KITCHEN • BHARATPUR
              </span>
            </Link>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-sm font-normal">
              A family-owned lodge in Bharatpur-10, Chitwan offering clean AC rooms, continuous hot showers, clay-oven tandoori grills, and local hospitality.
            </p>
          </div>

          {/* Navigation Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-stone-300 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">• Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">• About Us</Link></li>
              <li><Link href="/rooms" className="hover:text-white transition-colors">• Accommodations</Link></li>
              <li><Link href="/food" className="hover:text-white transition-colors">• Tandoori Menu</Link></li>
              <li><Link href="/attractions" className="hover:text-white transition-colors">• Chitwan Sights</Link></li>
            </ul>
          </div>

          {/* Practical Info Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider">
              Lodge Details
            </h4>
            <ul className="space-y-3 text-stone-300 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#A8BBA2] shrink-0 mt-1" />
                <span>Bharatpur-10, Narayangarh, Chitwan District, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#A8BBA2] shrink-0" />
                <span>+977 98550 12345 / 056-520123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#A8BBA2] shrink-0" />
                <span>info@motimahallodge.com</span>
              </li>
            </ul>
          </div>

          {/* Direct Contact Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <p className="text-stone-300 text-sm leading-relaxed font-normal">
              Call our front desk 24/7 for direct room availability, safari booking assistance, or highway directions.
            </p>
            <a
              href="tel:+9779855012345"
              className="inline-block px-5 py-3 bg-[#1F3A2B] hover:bg-[#112319] border border-stone-600 text-white font-semibold rounded-full text-xs sm:text-sm transition-colors shadow-xs uppercase tracking-wider"
            >
              Call Front Desk: +977 98550 12345
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-400 text-xs sm:text-sm gap-2">
          <span>© {new Date().getFullYear()} Motimahal Lodge & Tandoori Kitchen. All rights reserved.</span>
          <span>Bharatpur, Chitwan, Nepal</span>
        </div>
      </div>
    </footer>
  );
}
