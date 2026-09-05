'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContactSettings } from '@/lib/contact-settings';
import { ContactService } from '@/lib/services/contact.service';

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  telephone: z
    .string()
    .trim()
    .min(1, { message: 'Phone number is required' })
    .min(7, { message: 'Please enter a valid phone number (min 7 digits)' }),
  subject: z
    .string()
    .trim()
    .min(1, { message: 'Subject is required' })
    .min(3, { message: 'Subject must be at least 3 characters' }),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message is required' })
    .min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const contact = useContactSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await ContactService.submit({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.telephone,
        subject: data.subject,
        message: data.message,
      });
    } catch (e) {
      console.error('Failed to submit contact message:', e);
    }
    setSubmittedName(data.firstName);
    setSubmitted(true);
    reset();
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
                      Thank you, {submittedName}! We have received your message and our front desk family will get back to you shortly.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-bold text-brand-green hover:underline uppercase tracking-wider cursor-pointer"
                      >
                        ← Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                    {/* Row 1: First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name"
                          {...register('firstName')}
                          className={`w-full bg-white border ${
                            errors.firstName ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                          } rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Last Name"
                          {...register('lastName')}
                          className={`w-full bg-white border ${
                            errors.lastName ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                          } rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Email & Telephone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          {...register('email')}
                          className={`w-full bg-white border ${
                            errors.email ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                          } rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="tel"
                          placeholder="Telephone / Phone"
                          {...register('telephone')}
                          className={`w-full bg-white border ${
                            errors.telephone ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                          } rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                        />
                        {errors.telephone && (
                          <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.telephone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Subject */}
                    <div>
                      <input
                        type="text"
                        placeholder="Subject"
                        {...register('subject')}
                        className={`w-full bg-white border ${
                          errors.subject ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                        } rounded-md px-4 py-3 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <textarea
                        rows={6}
                        placeholder="Your Message..."
                        {...register('message')}
                        className={`w-full bg-white border ${
                          errors.message ? 'border-red-500 focus:border-red-600' : 'border-brand-border focus:border-stone-800'
                        } rounded-md p-4 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending...' : 'Submit'}
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
                      {contact.address}, {contact.cityProvince}
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
                      href={`mailto:${contact.email}`}
                      className="text-brand-gold font-semibold text-base hover:underline block"
                    >
                      {contact.email}
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
                      href={`tel:${contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="text-brand-gold font-bold text-xl hover:underline block"
                    >
                      {contact.primaryPhone}
                    </a>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-3 pt-4 border-t border-brand-border">
                    <h2 className="font-heading text-lg font-bold text-brand-charcoal tracking-wide">
                      Follow Us
                    </h2>
                    <div className="flex items-center gap-3">
                      <a
                        href={contact.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-md font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                      >
                        <FacebookIcon className="w-4 h-4" />
                        <span>Facebook</span>
                      </a>
                      <a
                        href={contact.instagramUrl}
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
            src={contact.googleMapEmbedUrl}
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
