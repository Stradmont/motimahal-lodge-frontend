'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { TESTIMONIALS_DATA } from '@/lib/data';
import { Star, CheckCircle2 } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(TESTIMONIALS_DATA);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev = {
      id: String(Date.now()),
      name,
      location: location || 'Guest',
      rating: 5,
      comment,
      date: 'Just now',
    };
    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setName('');
    setLocation('');
    setComment('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Guest Reviews & Reflections"
          subtitle="Read honest reflections from travelers, safari guests, and families who stayed at Motimahal Lodge."
          breadcrumbs={[{ label: 'Guest Reviews' }]}
        />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Reviews Summary Stats */}
            <div className="bg-white p-8 rounded-lg border border-[#E6DFD5] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-1">
                <span className="font-heading text-4xl font-bold text-[#1F3A2B]">4.8 / 5.0</span>
                <p className="text-xs text-stone-500 font-medium">Average Guest Rating</p>
              </div>
              <div className="space-y-1 md:border-x border-[#E6DFD5] px-4">
                <span className="font-heading text-4xl font-bold text-[#1F3A2B]">30+ Years</span>
                <p className="text-xs text-stone-500 font-medium">Serving Bharatpur Guests</p>
              </div>
              <div className="space-y-1">
                <span className="font-heading text-4xl font-bold text-[#1F3A2B]">100%</span>
                <p className="text-xs text-stone-500 font-medium">Authentic Family Care</p>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 sm:p-8 rounded-lg border border-[#E6DFD5] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <p className="text-stone-700 text-sm leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1F3A2B] block">{rev.name}</span>
                      <span className="text-stone-500 text-[11px]">{rev.location}</span>
                    </div>
                    <span className="text-[10px] bg-[#FAF7F2] text-[#1F3A2B] font-semibold px-2 py-0.5 rounded border border-[#E6DFD5]">
                      Verified Stay
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Your Review Form */}
            <div className="bg-white p-8 rounded-lg border border-[#E6DFD5] max-w-2xl mx-auto shadow-xs">
              <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-2 text-center">
                Leave a Review for Our Lodge
              </h3>
              <p className="text-xs text-stone-500 mb-6 text-center">
                Stayed with us recently? We would love to hear your feedback.
              </p>

              {submitted ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-[#1F3A2B]">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-stone-600">Your review has been added to our guest board.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saugat Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1F3A2B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Hometown / Country</label>
                      <input
                        type="text"
                        placeholder="e.g. Pokhara, Nepal"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1F3A2B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Your Experience / Comment *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details about your stay, rooms, or food..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded p-3 text-xs focus:outline-none focus:border-[#1F3A2B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs py-3 rounded transition-all cursor-pointer shadow"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
