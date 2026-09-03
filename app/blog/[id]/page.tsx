'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { BLOG_DATA } from '@/lib/data';
import { Calendar, User } from 'lucide-react';

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
        />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
            
            <div className="relative rounded-lg overflow-hidden border border-[#E6DFD5] shadow-md bg-stone-100 aspect-16/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-lg border border-[#E6DFD5] shadow-xs space-y-6">
              <div className="flex items-center gap-6 text-sm text-stone-500 font-medium border-b border-[#E6DFD5] pb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#1F3A2B]" />
                  {story.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#1F3A2B]" />
                  {story.author}
                </span>
              </div>

              <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>{story.content}</p>
                <p>
                  At Motimahal Lodge, we love sharing the rich heritage of Chitwan District with our guests. Whether you need local travel advice or wish to savor authentic clay-oven tandoori chicken, our family desk is always here to welcome you.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
