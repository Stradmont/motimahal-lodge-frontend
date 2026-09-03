'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import PageHero from '../../../components/PageHero';
import { BLOG_DATA } from '../../../lib/data';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const storyId = params?.id as string;

  const story = BLOG_DATA.find((b) => b.id === storyId) || BLOG_DATA[0];

  if (!story) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title={story.title}
          subtitle={story.excerpt}
          badge={story.category}
          breadcrumbs={[
            { label: 'Stories', href: '/blog' },
            { label: story.title },
          ]}
          bgImage={story.image}
        />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Meta Bar */}
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-4 text-xs text-stone-500 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  <User className="h-3.5 w-3.5 text-[#C88A3B]" />
                  <span>{story.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#C88A3B]" />
                  <span>Published {story.date}</span>
                </span>
              </div>

              <div>
                <span className="bg-[#FAF7F2] px-2.5 py-1 rounded border border-[#E6DFD5] text-[11px] font-semibold text-[#9E4B27]">
                  Category: {story.category}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden border border-[#E6DFD5] shadow-md bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>

            {/* Body Content */}
            <div className="bg-white p-6 sm:p-10 rounded-lg border border-[#E6DFD5] shadow-xs space-y-6 text-stone-700 text-sm sm:text-base leading-relaxed">
              {story.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Back to Stories */}
            <div className="pt-4 flex justify-between items-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1F3A2B] hover:text-[#9E4B27] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Stories & Travel Journal</span>
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
