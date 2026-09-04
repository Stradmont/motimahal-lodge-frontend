'use client';

import React from 'react';

const WHY_CHOOSE_ITEMS = [
  {
    icon: '/namche.svg',
    title: 'Narayani river views',
    description: 'Located in Bharatpur near the Narayani River, offering peaceful sunsets and views of surrounding Chitwan greenery.',
  },
  {
    icon: '/blankets.svg',
    title: 'Exceptional service',
    description: 'Our friendly family hosts are dedicated to ensuring your stay is comfortable, restful, and memorable.',
  },
  {
    icon: '/bedding.svg',
    title: 'Comfortable accommodation',
    description: 'Clean air-conditioned rooms with 24/7 solar hot showers and quiet garden surroundings for a true home away from home.',
  },
  {
    icon: '/mountain.svg',
    title: 'Easy highway access',
    description: 'Conveniently located near Bharatpur Airport, Narayangarh bus station, and just 30 mins drive from Chitwan National Park.',
  },
  {
    icon: '/cultural-immersion.svg',
    title: 'Cultural hospitality',
    description: 'Experience authentic Nepalese family hospitality, warm local tradition, and genuine community connection.',
  },
  {
    icon: '/memorable-dining.svg',
    title: 'On-site tandoori dining',
    description: 'Savor fresh clay-oven tandoori grills, authentic Nepalese Thakali thali sets, and local river fish at our restaurant.',
  },
];

export default function WhyChooseSection() {
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
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2B2A]">
            Why stay at Motimahal Lodge
          </h2>
          <p className="text-stone-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
            A welcoming family lodge providing clean rooms, authentic dining, and safari assistance in Bharatpur, Chitwan.
          </p>
        </div>

        {/* 6-Grid Feature Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
          {WHY_CHOOSE_ITEMS.map((item, index) => (
            <div key={index} className="space-y-3.5 max-w-sm mx-auto p-6 sm:p-8 bg-white/70 rounded-xl border border-[#E6DFD5] shadow-sm hover:shadow-md transition-shadow">

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
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2D2B2A]">
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

