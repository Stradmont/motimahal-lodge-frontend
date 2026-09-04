'use client';

import React from 'react';

const WHAT_TO_EXPECT_ITEMS = [
  {
    icon: '/mountain.svg',
    title: 'Narayani view',
    description: 'Enjoy peaceful river breezes and tranquil views of surrounding garden greenery in Bharatpur.',
  },
  {
    icon: '/namche.svg',
    title: 'Sunrise view',
    description: 'Wake up to soft morning light, fresh air, and quiet natural surroundings ideal for relaxation.',
  },
  {
    icon: '/blankets.svg',
    title: 'Blankets',
    description: 'Thoroughly sanitized, warm blankets provided in every room for cozy rest during cool nights.',
  },
  {
    icon: '/bedding.svg',
    title: 'Full bedding',
    description: 'Crisp laundered cotton bedsheets, plush pillows, and clean mattress setup for a restful sleep.',
  },
  {
    icon: '/bathroom.svg',
    title: 'Clean bathrooms',
    description: 'Attached ensuite bathroom with 24/7 solar hot shower water, clean towels, and essential amenities.',
  },
];

export default function WhatToExpectSection() {
  return (
    <section
      className="py-12 sm:py-16 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2B2A]">
            What to expect from our rooms
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            Every room at Motimahal Lodge is prepared with genuine family care, fresh laundered bedding, and quiet comfort.
          </p>
        </div>

        {/* 5-Item Grid Presentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
          {WHAT_TO_EXPECT_ITEMS.map((item, index) => (
            <div key={index} className="space-y-3 bg-white/70 p-5 rounded-lg border border-[#E6DFD5]/80 shadow-2xs backdrop-blur-2xs flex flex-col justify-between">

              {/* SVG Icon */}
              <div className="h-14 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="font-heading text-base font-bold text-[#2D2B2A]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
