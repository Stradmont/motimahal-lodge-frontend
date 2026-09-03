'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import BlogCard from '@/components/BlogCard';
import { BLOG_DATA } from '@/lib/data';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Stories & Travel Journal from Motimahal Lodge"
          subtitle="Practical Chitwan safari advice, local travel guides, and culinary stories from our tandoori kitchen."
          breadcrumbs={[{ label: 'Stories & Blog' }]}
        />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BLOG_DATA.map((story) => (
                <BlogCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
