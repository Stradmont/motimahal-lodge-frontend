'use client';

import React from 'react';
import Link from 'next/link';
import { Attraction } from '@/lib/data';
import { MapPin, ArrowRight } from 'lucide-react';

interface AttractionCardProps {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attraction.image}
          alt={attraction.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
          <MapPin className="h-3 w-3 text-white" />
          <span>{attraction.distance}</span>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[#1F3A2B] text-[10px] font-bold uppercase tracking-wider block">
            {attraction.category}
          </span>
          <h3 className="font-heading text-xl font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors">
            {attraction.title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
            {attraction.shortDesc}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E6DFD5]">
          <Link
            href={`/attractions/${attraction.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A2B] hover:text-[#162B20] transition-colors"
          >
            <span>Explore Experience</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
