'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-hero text-muted-light/60 py-16 px-4 sm:px-6 lg:px-8 border-t border-primary-accent/15">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 text-primary-light">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-light shadow-sm">
              <Compass className="h-5 w-5 stroke-[1.5]" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-serif font-semibold tracking-tight text-white">Motimahal</span>
              <span className="text-[9px] tracking-wider uppercase text-primary-accent font-bold">Lodge · Chitwan</span>
            </div>
          </Link>
          <p className="text-xs leading-relaxed text-muted/80 font-normal">
            An eco-friendly sanctuary nestled on the edge of Chitwan National Park in Sauraha, blending wild rustic nature with warm Nepalese hospitality.
          </p>
        </div>

        {/* Guest Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-primary-accent uppercase tracking-[0.15em]">Explore</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/" className="hover:text-primary-accent transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-primary-accent transition-colors">Rooms & Booking</Link>
            </li>
            <li>
              <Link href="/food" className="hover:text-primary-accent transition-colors">Restaurant Menu</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary-accent transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Staff & Portals */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-primary-accent uppercase tracking-[0.15em]">Services</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/portal" className="hover:text-primary-accent transition-colors">Guest Portal Login</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-primary-accent transition-colors">Staff Dashboard</Link>
            </li>
            <li>
              <Link href="/kitchen" className="hover:text-primary-accent transition-colors">Kitchen Board</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-primary-accent uppercase tracking-[0.15em]">Contact Details</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-muted">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-accent shrink-0" />
              <span>Sauraha, Chitwan, Nepal</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-accent shrink-0" />
              <span>+977 56 580123 / 9845012345</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary-accent shrink-0" />
              <span>stay@motimahallodge.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="h-px bg-primary-accent/10 mb-8"></div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div>
          <span>&copy; {new Date().getFullYear()} Motimahal Lodge. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] bg-primary-light/5 text-primary-accent/30 border border-primary-accent/10 px-2 py-0.5 rounded">
            Designed for Sauraha Eco-Tourism
          </span>
        </div>
      </div>
    </footer>
  );
}
