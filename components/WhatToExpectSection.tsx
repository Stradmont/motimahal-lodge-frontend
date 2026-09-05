'use client';

import React from 'react';

const WHAT_TO_EXPECT_ITEMS = [
  {
    icon: '/icons/mountain.svg',
    title: 'River views',
    description: 'Catch gentle river breezes and views of the Narayani River and our peaceful garden.',
  },
  {
    icon: '/icons/namche.svg',
    title: 'Morning sunlight',
    description: 'Bright morning light and fresh air in every room, perfect for quiet morning tea.',
  },
  {
    icon: '/icons/blankets.svg',
    title: 'Warm blankets',
    description: 'Clean, heavy blankets in every room to keep you warm on cool Chitwan evenings.',
  },
  {
    icon: '/icons/bedding.svg',
    title: 'Fresh bedding',
    description: 'Freshly washed cotton sheets, soft pillows, and comfortable mattresses in every room.',
  },
  {
    icon: '/icons/bathroom.svg',
    title: 'Private bathroom',
    description: 'Clean attached bathroom with 24/7 hot water, fresh towels, and soap.',
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
            We keep our rooms simple, clean, and comfortable—so you can relax and feel right at home.
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
