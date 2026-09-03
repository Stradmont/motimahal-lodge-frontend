'use client';

import React from 'react';

const WHY_CHOOSE_ITEMS = [
  {
    icon: '/namche.svg',
    title: 'Narayani River Views',
    description: 'Located in Bharatpur-10 near the Narayani River, offering peaceful sunsets and views of surrounding Chitwan greenery.',
  },
  {
    icon: '/blankets.svg',
    title: 'Exceptional Service',
    description: 'Our friendly family hosts are dedicated to ensuring your stay is comfortable, restful, and memorable.',
  },
  {
    icon: '/bedding.svg',
    title: 'Comfortable Accommodation',
    description: 'Clean air-conditioned rooms with 24/7 solar hot showers and quiet garden surroundings for a true home away from home.',
  },
  {
    icon: '/mountain.svg',
    title: 'Easy Access',
    description: 'Conveniently located near Bharatpur Airport, Narayangarh bus station, and just 30 mins drive from Chitwan National Park.',
  },
  {
    icon: '/cultural-immersion.svg',
    title: 'Cultural Immersion',
    description: 'Experience authentic Nepalese hospitality, warm local tradition, and genuine community connection.',
  },
  {
    icon: '/memorable-dining.svg',
    title: 'Memorable Dining',
    description: 'Savor fresh clay-oven tandoori grills, authentic Nepalese Thakali thali sets, and local river fish at our restaurant.',
  },
];

export default function WhyChooseSection() {
  return (
    <section
      className="py-20 sm:py-28 border-b border-[#E6DFD5] relative text-[#2D2B2A]"
      style={{
        backgroundImage: "url('/backs.png')",
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-wider text-[#2D2B2A]">
            WHY CHOOSE MOTIMAHAL LODGE AND RESTAURANT
          </h2>
        </div>

        {/* 6-Grid Feature Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 text-center">
          {WHY_CHOOSE_ITEMS.map((item, index) => (
            <div key={index} className="space-y-4 max-w-sm mx-auto">
              
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
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D2B2A]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
