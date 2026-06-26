import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-primary-accent/10 px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
              <Image
                src="/logo.png"
                alt="Motimahal Lodge"
                width={110}
                height={40}
                className="object-contain brightness-0 invert opacity-90"
              />
            <p className="text-xs text-white/55 leading-relaxed max-w-xs">
              A family-run lodge in Bharatpur, Chitwan. Comfortable rooms, tandoori cuisine,
              and a peaceful riverside sanctuary near the beautiful Narayani River.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent">
              Pages
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { href: '/',        label: 'Home' },
                { href: '/about',   label: 'About Us' },
                { href: '/rooms',   label: 'Rooms' },
                { href: '/food',    label: 'Food Menu' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent">
              Find us
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-primary-accent shrink-0 mt-0.5" />
                <span className="text-xs text-white/55 leading-relaxed">
                  New Road, Bharatpur, Chitwan, Nepal
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-3.5 w-3.5 text-primary-accent shrink-0 mt-0.5" />
                <span className="text-xs text-white/55">+977 56 580123</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-3.5 w-3.5 text-primary-accent shrink-0 mt-0.5" />
                <span className="text-xs text-white/55">stay@motimahallodge.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/30">
            © {new Date().getFullYear()} Motimahal Lodge · Bharatpur, Chitwan
          </p>
          <p className="text-[10px] text-white/20">
            अतिथि देवो भव
          </p>
        </div>

      </div>
    </footer>
  );
}
