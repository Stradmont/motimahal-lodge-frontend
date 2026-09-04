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
    <div className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">

      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attraction.image}
          alt={attraction.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded shadow flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-white" />
          <span>{attraction.distance}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="text-brand-green text-xs font-bold uppercase tracking-wider block">
            {attraction.category}
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-green group-hover:text-brand-green-dark transition-colors">
            {attraction.title}
          </h3>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
            {attraction.shortDesc}
          </p>
        </div>

        <div className="pt-4 border-t border-brand-border">
          <Link
            href={`/attractions/${attraction.id}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors"
          >
            <span>Explore Experience</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
