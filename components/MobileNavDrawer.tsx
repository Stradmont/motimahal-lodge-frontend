'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, MapPin, Phone } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  items,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const animFrame = requestAnimationFrame(() => {
        setVisible(true);
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        cancelAnimationFrame(animFrame);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setVisible(false);
    }
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Side Drawer Panel */}
      <div
        className={`relative z-10 h-full min-h-screen w-full max-w-[300px] text-[#162B20] flex flex-col justify-between shadow-2xl border-l border-stone-200/60 overflow-y-auto transform transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundImage: "url('/backs.png')",
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Clean Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/60 shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Motimahal Lodge"
              className="h-9 w-auto object-contain rounded-full"
            />
            <span className="font-heading text-xl font-bold text-[#162B20]">
              Motimahal
            </span>
          </Link>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer rounded-full hover:bg-stone-200/50"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Minimal Navlist with Mirza Font */}
        <nav className="py-6 px-4 space-y-1 flex-1 overflow-y-auto">
          {items.map((item, idx) => {
            const active = isActive(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg font-heading text-xl font-medium transition-colors ${
                  active
                    ? 'text-[#C88A3B] bg-[#162B20]/5 font-semibold'
                    : 'text-[#162B20] hover:text-[#C88A3B] hover:bg-stone-200/40'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C88A3B]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Clean Minimal Footer */}
        <div className="p-6 border-t border-stone-200/60 bg-stone-50/50 shrink-0 space-y-3.5 text-xs text-stone-600">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#C88A3B] shrink-0" />
              <span>Bharatpur, Chitwan</span>
            </div>
            <a
              href="tel:+9779855012345"
              className="flex items-center gap-1.5 hover:text-[#162B20] font-medium transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[#C88A3B] shrink-0" />
              <span>+977 98550 12345</span>
            </a>
          </div>

          <Link
            href="/enquiry"
            onClick={onClose}
            className="w-full bg-[#162B20] hover:bg-[#1F3A2B] text-white font-medium text-xs py-2.5 px-4 rounded-md transition-colors cursor-pointer shadow-xs flex items-center justify-center text-center"
          >
            Book Stay
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
