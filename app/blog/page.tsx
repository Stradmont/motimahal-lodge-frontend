'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import BlogCard from '@/components/BlogCard';
import WhyChooseSection from '@/components/WhyChooseSection';
import { BLOG_DATA } from '@/lib/data';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Stories From Chitwan"
          subtitle="Local insights, safari advice, and authentic food recipes from Motimahal Lodge family."
          breadcrumbs={[{ label: 'Stories' }]}
        />

        <section
          className="py-16 sm:py-24 border-b border-[#E6DFD5]"
          style={{
            backgroundImage: "url('/backs.png')",
            backgroundRepeat: 'repeat',
          }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
            {BLOG_DATA.map((story) => (
              <BlogCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <WhyChooseSection />
      </main>

      <Footer />
    </div>
  );
}
