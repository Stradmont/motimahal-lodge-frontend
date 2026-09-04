'use client';

import React from 'react';

const WHAT_TO_EXPECT_ITEMS = [
  {
    icon: '/icons/mountain.svg',
    title: 'Narayani view',
    description: 'Enjoy peaceful river breezes and tranquil views of surrounding garden greenery in Bharatpur.',
  },
  {
    icon: '/icons/namche.svg',
    title: 'Sunrise view',
    description: 'Wake up to soft morning light, fresh air, and quiet natural surroundings ideal for relaxation.',
  },
  {
    icon: '/icons/blankets.svg',
    title: 'Blankets',
    description: 'Thoroughly sanitized, warm blankets provided in every room for cozy rest during cool nights.',
  },
  {
    icon: '/icons/bedding.svg',
    title: 'Full bedding',
    description: 'Crisp laundered cotton bedsheets, plush pillows, and clean mattress setup for a restful sleep.',
  },
  {
    icon: '/icons/bathroom.svg',
    title: 'Clean bathrooms',
    description: 'Attached ensuite bathroom with 24/7 solar hot shower water, clean towels, and essential amenities.',
  },
];

export default function WhatToExpectSection() {
  return (
    <section className="py-12 sm:py-16 border-b border-brand-border relative text-brand-charcoal bg-texture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal">
            What to expect from our rooms
          </h2>
          <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
            Every room at Motimahal Lodge is prepared with genuine family care, fresh laundered bedding, and quiet comfort.
          </p>
        </div>

        {/* 5-Item Grid Presentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
          {WHAT_TO_EXPECT_ITEMS.map((item, index) => (
            <div key={index} className="space-y-3.5 bg-white/70 p-6 rounded-xl border border-brand-border shadow-sm hover:shadow-md transition-shadow backdrop-blur-2xs flex flex-col justify-between">

              {/* SVG Icon */}
              <div className="h-16 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-14 w-auto object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-brand-charcoal">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal">
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
