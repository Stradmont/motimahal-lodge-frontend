'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { SOCIAL_LINKS } from '@/lib/data';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <Navbar />

      <main className="flex-1">

        {/* 1. HERO SECTION WITH BACKGROUND IMAGE */}
        <section className="relative w-full h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/heroes/contact-hero.jpg')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/55 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <span className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] block">
              REACH OUT TO US
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              CONTACT US
            </h1>
          </div>
        </section>

        {/* GET IN TOUCH SECTION WITH backs.png BACKGROUND TEXTURE */}
        <section className="py-20 sm:py-28 border-b border-brand-border relative text-brand-charcoal bg-texture">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left Column: Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal">
                  Get in Touch
                </h1>

                {submitted ? (
                  <div className="bg-white p-8 rounded-lg border border-brand-border text-center space-y-4 shadow-xs">
                    <CheckCircle2 className="h-12 w-12 text-brand-green mx-auto" />
                    <h2 className="font-heading text-2xl font-bold text-brand-charcoal">
                      Message Sent Successfully!
                    </h2>
                    <p className="text-stone-600 text-base leading-relaxed max-w-md mx-auto">
                      Thank you, {firstName}! We have received your message and our front desk family will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Row 1: First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Telephone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="Telephone"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 3: Subject */}
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-white border border-brand-border rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                      />
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <textarea
                        required
                        rows={6}
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white border border-brand-border rounded-md p-4 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-800 shadow-2xs"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      >
                        Submit
                      </button>
                    </div>

                  </form>
                )}
              </div>

              {/* Right Column: Address, Email, Telephone Card (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-white p-8 sm:p-10 rounded-lg border border-brand-border shadow-xs space-y-8">

                  {/* Address */}
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-gold">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-brand-charcoal tracking-wide">
                      Address
                    </h2>
                    <p className="text-stone-700 text-base leading-relaxed font-normal">
                      Bharatpur-10, Narayangarh, Chitwan District, Bagmati Province, Nepal
                    </p>
                  </div>

                  {/* Email address */}
                  <div className="space-y-2 pt-4 border-t border-brand-border">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-gold">
                      <Mail className="h-7 w-7" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-brand-charcoal tracking-wide">
                      Email address
                    </h2>
                    <a
                      href="mailto:info@motimahallodge.com"
                      className="text-brand-gold font-semibold text-base hover:underline block"
                    >
                      info@motimahallodge.com
                    </a>
                  </div>

                  {/* Telephone */}
                  <div className="space-y-2 pt-4 border-t border-brand-border">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-gold">
                      <Phone className="h-7 w-7" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-brand-charcoal tracking-wide">
                      Telephone
                    </h2>
                    <a
                      href="tel:+9779855012345"
                      className="text-brand-gold font-bold text-xl hover:underline block"
                    >
                      +977 98550 12345
                    </a>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-3 pt-4 border-t border-brand-border">
                    <h2 className="font-heading text-lg font-bold text-brand-charcoal tracking-wide">
                      Follow Us
                    </h2>
                    <div className="flex items-center gap-3">
                      <a
                        href={SOCIAL_LINKS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-md font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                      >
                        <FacebookIcon className="w-4 h-4" />
                        <span>Facebook</span>
                      </a>
                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white rounded-md font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                      >
                        <InstagramIcon className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FULL-WIDTH GOOGLE MAP EMBED */}
        <section className="w-full h-112 bg-stone-200 border-b border-brand-border">
          <iframe
            title="Motimahal Lodge Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.787687834571!2d84.428781!3d27.678951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb2193b2160d%3A0x6b4f74d0e68d0d0!2sBharatpur%2044200%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

      </main>

      <Footer />
    </div>
  );
}
