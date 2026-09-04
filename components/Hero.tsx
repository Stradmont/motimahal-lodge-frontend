'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('about');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[680px] flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Full Screen Edge-to-Edge Photography Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
        }}
      />

      {/* Dark Opacity Overlay */}
      <div className="absolute inset-0 z-10 bg-black/45" />

      {/* Centered Main Title */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-6">

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-md leading-tight">
          MOTIMAHAL LODGE & RESTAURANT
        </h1>

       
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80 animate-bounce">
        <a
          href="#about"
          onClick={handleScrollToAbout}
          aria-label="Scroll to About section"
          className="p-2 inline-block cursor-pointer"
        >
          <ChevronDown className="h-8 w-8 text-white/90" />
        </a>
      </div>
    </section>
  );
}
