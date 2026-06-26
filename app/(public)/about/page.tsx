'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, Waves, Compass, Sparkles, Building2, MapPin, 
  UtensilsCrossed, Calendar, Check, ArrowRight 
} from 'lucide-react';

export default function AboutPage() {
  const timelineMilestones = [
    {
      year: '2061 B.S.',
      title: 'The Journey Begins',
      description: 'Our founder opened the original Motimahal Hotel & Tandoori Restaurant with a simple mission: to serve delicious tandoori cuisine, provide genuine hospitality, and build a welcoming community space like family.'
    },
    {
      year: '2069 B.S.',
      title: 'A Vision Architected',
      description: 'Seeing travelers and families struggle to find peaceful, high-quality stays in Narayanghat, our founder designed our family home. It was thoughtfully structured from day one with the blueprint of a future guest house and lodge.'
    },
    {
      year: 'The Transition',
      title: 'Commitment & Rebuilding',
      description: 'Turning the dream into reality required patience. Years of careful planning, requesting long-term tenants to relocate, and major renovations followed to rebuild the space into a premium riverside escape.'
    },
    {
      year: 'Today',
      title: 'Motimahal Lodge Opens',
      description: 'After 13 years of dreaming and nearly two decades of culinary hospitality, the vision officially came alive. Motimahal Lodge now stands beside the Narayani River, offering peaceful stays and delicious food.'
    }
  ];

  const highlights = [
    'Comfortable lodging with modern rooms',
    'Authentic tandoori & family-kitchen cuisine',
    'Warm family-run hospitality and personal care',
    'Peaceful surroundings by the Narayani River',
    'Convenient access from Narayanghat & Bharatpur'
  ];

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* ─────────────────────────────────────────────────────────
          HERO BANNER
          ───────────────────────────────────────────────────────── */}
      <section className="banner-luxury relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <span className="badge-luxury mb-4 inline-flex items-center gap-1.5 mx-auto">
            <Sparkles className="h-3 w-3" /> Namaste
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            About Us
          </h1>
          <div className="editorial-line mx-auto"></div>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed mt-5">
            Motimahal is more than just a restaurant and lodge—it is a dream built with patience, 
            family values, and nearly two decades of dedication to hospitality in Chitwan.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          EDITORIAL STORY SECTION
          ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Visual assets */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <Image 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600" 
                alt="Narayani River Sunset" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md translate-y-6">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600" 
                alt="Motimahal Lodge Veranda" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>

          {/* Right Column: Historical Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              Behind the Brand
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              A Legacy of Warmth & Care
            </h2>
            <div className="editorial-line"></div>
            
            <div className="text-sm sm:text-[15px] text-muted leading-relaxed flex flex-col gap-5 mt-2">
              <p>
                In the heart of New Road, Bharatpur – Chitwan, Motimahal stands proudly as a family-run 
                hospitality destination. Our journey began in <strong>2061 B.S.</strong>, when our founder started 
                Motimahal Hotel & Tandoori Restaurant with a simple mission: serve delicious food, provide 
                genuine hospitality, and create a place where people feel welcomed like family.
              </p>
              <p>
                For almost 20 years, Motimahal became a trusted name for good food and warm service. 
                But there was another dream quietly growing. Seeing travelers, families, and visitors 
                struggle to find a comfortable, peaceful, and quality place to stay in Narayanghat, 
                our founder imagined something bigger—a place where people could truly relax, stay, and 
                experience hospitality beyond food.
              </p>
              <p>
                Long before it became reality, he had already designed our family home with this vision in mind. 
                In <strong>2069 B.S.</strong>, our building was thoughtfully designed as a future guest house and lodge—a 
                dream planned years before construction even began.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TIMELINE SECTION
          ───────────────────────────────────────────────────────── */}
      <section className="bg-primary-light/20 border-t border-b border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              Our Journey
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
              Timeline of Motimahal
            </h2>
            <div className="editorial-line mx-auto mt-3"></div>
          </div>

          <div className="relative border-l-2 border-primary-accent/35 ml-4 sm:ml-6 flex flex-col gap-12">
            {timelineMilestones.map((milestone, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10">
                {/* Timeline dot */}
                <span className="absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 border-primary-accent shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent"></span>
                </span>
                
                <span className="text-xs font-bold text-primary-accent tracking-wider uppercase">
                  {milestone.year}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">
                  {milestone.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2 max-w-2xl">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TODAY & THE RIVER SECTION
          ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Riverside Copy */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              Nature & Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Beside the Narayani River
            </h2>
            <div className="editorial-line"></div>
            
            <div className="text-sm sm:text-[15px] text-muted leading-relaxed flex flex-col gap-4 mt-2">
              <p>
                Today, Motimahal Lodge stands proudly beside the beautiful Narayani River, offering guests 
                a peaceful escape surrounded by nature, fresh air, and authentic hospitality built from over 
                20 years of experience.
              </p>
              <p>
                Wake up to greenery, flowing river views, and the calmness of nature. During summer, you may 
                even witness one of Chitwan’s magical surprises—rhinos occasionally roaming near the riverside 
                area, creating unforgettable moments for our guests.
              </p>
              <p>
                Located just <strong>900 metres</strong> from our iconic Motimahal Tandoori Restaurant in Pulchowk, 
                our lodge gives guests the best of both worlds—comfortable stays and delicious food nearby. At 
                Motimahal Lodge, nights come with the soothing sound of the nearby river—nature’s own sleep 
                music, no playlist needed.
              </p>
            </div>
          </div>

          {/* Right Column: Key Offerings Grid */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-8 shadow-md">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary-accent" /> About Us
            </h3>
            
            <div className="flex flex-col gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-3.5 items-start">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-light text-primary border border-primary-accent/20 shrink-0 mt-0.5 shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span className="text-xs sm:text-sm text-muted font-medium">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Link 
                href="/rooms" 
                className="btn-luxury-primary text-center w-full sm:w-auto"
              >
                Book a Room <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link 
                href="/contact" 
                className="btn-luxury-outline text-center w-full sm:w-auto"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
