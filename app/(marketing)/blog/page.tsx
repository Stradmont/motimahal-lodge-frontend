'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyChooseSection from '@/components/WhyChooseSection';
import CtaSection from '@/components/CtaSection';
import { BLOG_DATA } from '@/lib/data';
import { ArrowRight, Clock, User, Calendar } from 'lucide-react';

export default function BlogListingPage() {
  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/heroes/blog-hero.jpg')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
              Stories & Travel Guides
            </h1>
            <p className="text-stone-200 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Local travel advice, safari planning tips, and authentic culinary stories from Motimahal Lodge in Chitwan.
            </p>
          </div>
        </section>

        {/* 2. BLOG LISTING GRID */}
        <section className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal">
                Latest Articles & Hospitality Stories
              </h2>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                Explore local insight from our family host team for your visit to Chitwan National Park and Bharatpur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {BLOG_DATA.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Header */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded shadow-md">
                      {post.category}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md border border-brand-border text-stone-600 text-xs font-medium shadow-md flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-brand-green" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="text-xs text-stone-500 font-medium flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-brand-green" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-brand-green" />
                          {post.author}
                        </span>
                      </div>

                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal group-hover:text-brand-green transition-colors leading-snug">
                        <Link href={`/blog/${post.slug || post.id}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal line-clamp-3">
                        {post.excerpt}
                      </p>

                      {post.tags && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {post.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="bg-brand-surface text-stone-700 text-xs px-2.5 py-1 rounded border border-brand-border font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action CTA */}
                    <div className="pt-2">
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="bg-brand-green hover:bg-brand-green-dark border border-footer-border text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-md transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                      >
                        <span>Read full article</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* 4. FINAL CTA SECTION */}
        <CtaSection
          title="Planning a stay at Motimahal Lodge?"
          description="Book your room directly for guaranteed rates, safari booking assistance, and authentic local food."
          buttonText="Check room availability & enquiry"
          buttonHref="/enquiry"
          bgTexture={true}
        />
      </main>

      <Footer />
    </div>
  );
}
