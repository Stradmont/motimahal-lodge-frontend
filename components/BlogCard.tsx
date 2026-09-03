'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/data';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  story: BlogPost;
}

export default function BlogCard({ story }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E6DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row group">
      
      <div className="sm:w-2/5 relative aspect-4/3 sm:aspect-auto overflow-hidden bg-stone-100 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-[#1F3A2B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
          {story.category}
        </div>
      </div>

      <div className="p-5 sm:w-3/5 space-y-3 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#1F3A2B]" />
              {story.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-[#1F3A2B]" />
              {story.author}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-[#1F3A2B] group-hover:text-[#162B20] transition-colors leading-snug">
            {story.title}
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {story.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E6DFD5]">
          <Link
            href={`/blog/${story.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A2B] hover:text-[#162B20] transition-colors"
          >
            <span>Read Full Story</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
