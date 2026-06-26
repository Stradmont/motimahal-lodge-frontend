'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const timelineMilestones = [
    {
      year: '2061 B.S. (2004 A.D.)',
      title: 'Beginning with Tandoori',
      description: 'Our founder opened the original Motimahal Hotel & Tandoori Restaurant at Pulchowk. The mission was simple: serve delicious food, treat guests like family, and build a trusted name for hospitality in Bharatpur.'
    },
    {
      year: '2069 B.S. (2012 A.D.)',
      title: 'A House Designed for Guests',
      description: 'With travelers and visiting families struggling to find a comfortable and quiet place to stay in Narayanghat, our founder designed our family home. Long before it became reality, the building was structured to one day serve as a lodge.'
    },
    {
      year: 'The Renovation',
      title: 'Patient Rebuilding',
      description: 'Dreams take time. After more than a decade, we requested long-term tenants to relocate so we could begin the transition. Years of renovations, rebuilding, and planning followed to bring the lodge to life.'
    },
    {
      year: 'Today',
      title: 'Motimahal Lodge Opens',
      description: 'Our vision finally came alive as Motimahal Lodge. Today, we welcome travelers to a peaceful sanctuary by the Narayani River, combining comfortable lodging with our family’s 20-year history of hospitality.'
    }
  ];

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* ─────────────────────────────────────────────────────────
          HERO HEADER
          ───────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent mb-3">
          ESTABLISHED 2061 B.S. · BHARATPUR, CHITWAN
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground mb-6">
          About Motimahal
        </h1>
        <div className="w-12 h-0.5 bg-primary-accent mx-auto mb-8"></div>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-sans">
          Motimahal is a family-run hospitality destination built with patience, family values, and nearly two decades of dedication.
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────
          THE NARRATIVE
          ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Story Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 font-sans text-sm sm:text-[15px] text-muted leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-tight">
              A Family Dream in Chitwan
            </h2>

            <p>
              In the heart of New Road, Bharatpur, Motimahal is more than just a restaurant and lodge—it is a family dream. Our journey began in <strong>2061 B.S.</strong>, when our founder started Motimahal Hotel & Tandoori Restaurant in Pulchowk. We focused on simple hospitality: warm service, comfortable settings, and authentic, delicious food.
            </p>
            <p>
              For nearly twenty years, the restaurant grew as a local landmark. However, our founder held a second dream: seeing travelers, families, and visitors struggle to find a truly peaceful, high-quality place to relax and stay in Narayanghat, he envisioned a dedicated lodge.
            </p>
            <p>
              He designed our family home with this future in mind. In <strong>2069 B.S.</strong>, the building was thoughtfully structured to eventually act as a guest house and lodge, years before construction even commenced.
            </p>
            <blockquote className="border-l-2 border-primary-accent pl-4 py-1 my-2 text-foreground font-serif italic text-base">
              "We believe hospitality is not only about rooms or food. It is about warmth. Care. Comfort. Stories. And making every guest feel at home."
            </blockquote>
            <p>
              Turning a dream into reality takes time. After more than a decade, long-term tenants were respectfully requested to relocate, and years of renovation, rebuilding, planning, and commitment followed. Today, that vision stands proudly beside the Narayani River as <strong>Motimahal Lodge</strong>.
            </p>
          </div>

          {/* Side visual & quick facts */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted-light">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                alt="Motimahal Lodge Veranda"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                At a Glance
              </h3>
              <ul className="flex flex-col gap-3.5 text-xs text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent shrink-0 mt-1.5" />
                  <span><strong>Comfortable Lodging:</strong> Quiet rooms designed to stay naturally cool.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent shrink-0 mt-1.5" />
                  <span><strong>Authentic Food:</strong> Renowned tandoori cuisine served daily.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent shrink-0 mt-1.5" />
                  <span><strong>Riverside Surroundings:</strong> Located by the beautiful Narayani River.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-accent shrink-0 mt-1.5" />
                  <span><strong>Prime Location:</strong> 900 meters from our Pulchowk restaurant.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TIMELINE / MILESTONES (EDITORIAL & TYPOGRAPHIC)
          ───────────────────────────────────────────────────────── */}
      <section className="bg-primary-light/35 border-t border-b border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              OUR HISTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-2">
              Milestones Over 20 Years
            </h2>
            <div className="w-10 h-0.5 bg-primary-accent mx-auto mt-4"></div>
          </div>

          <div className="flex flex-col gap-10">
            {timelineMilestones.map((milestone, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start pt-6 border-t border-border/60 first:border-none">
                <div className="md:col-span-3">
                  <span className="font-serif text-lg font-bold text-primary-accent">
                    {milestone.year}
                  </span>
                </div>
                <div className="md:col-span-9 flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          RIVERSIDE SURROUNDINGS & Wildlife
          ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-accent">
              RIVERSIDE SANCTUARY
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              A Peaceful Escape Beside the Narayani River
            </h2>
            <div className="w-10 h-0.5 bg-primary-accent"></div>

            <div className="text-sm sm:text-[15px] text-muted leading-relaxed flex flex-col gap-4 font-sans mt-2">
              <p>
                Located proudly by the flowing waters of the Narayani River, Motimahal Lodge offers guests a quiet retreat surrounded by greenery and fresh air. It is a place where you can sit by the garden verandas, listen to birds, and feel connected to the environment.
              </p>
              <p>
                During the warm summer months, guests may even spot Chitwan's roaming rhinos near the riverbed, offering a memorable look at the area's wild nature.
              </p>
              <p>
                At night, the lodge is filled with the soothing sound of the Narayani—nature's own peaceful sleep music. And when you are ready for a meal, our famous tandoori kitchen in Pulchowk is just a short 900-meter walk away.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted-light">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800"
                alt="Narayani River Sunset"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="flex gap-4">
              <Link
                href="/rooms"
                className="btn-luxury-primary text-center flex-1"
              >
                View Rooms <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="btn-luxury-outline text-center flex-1"
              >
                Find Us
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
