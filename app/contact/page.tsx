'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2B2A]">
      <Navbar />

      <main className="flex-1">
        <PageHero
          title="Contact & Location"
          subtitle="Get in touch with Motimahal Lodge front desk, check travel directions, or send us a message."
          breadcrumbs={[{ label: 'Contact Us' }]}
        />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Contact Cards */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[#1F3A2B] text-xs font-semibold uppercase tracking-wider block">
                    Get in Touch
                  </span>
                  <h2 className="font-heading text-3xl font-bold text-[#1F3A2B]">
                    We’re Always Available
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Whether you have questions about room availability, airport pickups, or Chitwan safari planning, our desk is happy to help.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#E6DFD5] shadow-xs space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded bg-[#1F3A2B] text-white flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1F3A2B]">Lodge Address</h4>
                      <p className="text-stone-600">Bharatpur-10, Narayangarh, Chitwan District, Bagmati Province, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#E6DFD5]">
                    <div className="w-9 h-9 rounded bg-[#1F3A2B] text-white flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1F3A2B]">Telephone & WhatsApp</h4>
                      <p className="text-stone-600">+977 98550 12345 / 056-520123</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#E6DFD5]">
                    <div className="w-9 h-9 rounded bg-[#1F3A2B] text-white flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1F3A2B]">Email Address</h4>
                      <p className="text-stone-600">info@motimahallodge.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-[#E6DFD5]">
                    <div className="w-9 h-9 rounded bg-[#1F3A2B] text-white flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#1F3A2B]">Front Desk Hours</h4>
                      <p className="text-stone-600">24/7 Front Desk Assistance | Check-in: 12:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Directions Guide */}
                <div className="bg-[#FAF7F2] text-stone-800 p-6 rounded-lg border border-[#E6DFD5] space-y-2 text-xs">
                  <h4 className="font-heading text-base font-bold text-[#1F3A2B]">How to Reach Us</h4>
                  <p className="text-stone-600">
                    • <strong>From Bharatpur Airport:</strong> 4 km (10 mins by taxi)<br />
                    • <strong>From Narayangarh Bus Park:</strong> 1.5 km (5 mins drive)<br />
                    • <strong>From Kathmandu/Pokhara:</strong> Prithvi & Mahendra Highway to Bharatpur-10
                  </p>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 rounded-lg border border-[#E6DFD5] shadow-xs">
                  <h3 className="font-heading text-2xl font-bold text-[#1F3A2B] mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-stone-500 mb-6">
                    Fill out the form below and our family team will get back to you within a few hours.
                  </p>

                  {submitted ? (
                    <div className="text-center py-10 space-y-3">
                      <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                      <h4 className="font-heading text-xl font-bold text-[#1F3A2B]">Message Sent Successfully!</h4>
                      <p className="text-xs text-stone-600 max-w-sm mx-auto">
                        Thank you, {name}. We have received your inquiry and will reply to your message shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Prashant Sapkota"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+977 98XXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-[#1F3A2B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Write your questions regarding rooms, food, safari tours, or directions..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E6DFD5] rounded p-3 text-xs focus:outline-none focus:border-[#1F3A2B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1F3A2B] hover:bg-[#162B20] text-white font-semibold text-xs py-3.5 rounded transition-all cursor-pointer shadow flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
