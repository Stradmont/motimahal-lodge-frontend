'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Calendar, Users, Shield, CheckCircle2, ChevronRight,
  Moon, Utensils, ArrowRight, Leaf, Coffee, Compass, Sparkles
} from 'lucide-react';

export default function Home() {
  const { roomTypes, checkAvailability, getAvailableCount, isLoaded, foodItems } = useApp();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayStr());
  const [checkOut, setCheckOut] = useState(getTomorrowStr());
  const [guests, setGuests] = useState('2');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const featuredFood = isLoaded
    ? foodItems.filter((f) => f.isAvailable).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col flex-1 bg-background">

      {/* ── HERO SECTION (Asymmetric Magazine Editorial Layout) ── */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-primary-light/35">
        
        {/* Soft decorative background elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-accent/5 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/3"></div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Brand, Tagline, Booking Widget */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="badge-luxury mb-6">
              <Sparkles className="h-3 w-3" /> Atithi Devo Bhava · Guest is God
            </span>
            
            <h1 className="text-title-hero mb-6">
              A peaceful garden home on the edge of <span className="font-bold text-primary-accent">Chitwan's forest</span>
            </h1>
            
            <p className="text-sm sm:text-base text-muted max-w-xl mb-8 leading-relaxed">
              Namaste. Since 1998, our family has welcomed travelers to the quiet village of Sauraha. Inspired by traditional clay-walled cottages, Motimahal is a peaceful green space where you can listen to bird calls from the national park and watch the sunset over the Rapti River.
            </p>

            {/* Booking Widget Container */}
            <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xl relative">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Check-In */}
                  <div className="input-luxury-container">
                    <label className="input-luxury-label">
                      <Calendar className="h-3.5 w-3.5 text-primary-accent" /> Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={getTodayStr()}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (new Date(e.target.value) >= new Date(checkOut)) {
                          const next = new Date(e.target.value);
                          next.setDate(next.getDate() + 1);
                          setCheckOut(next.toISOString().split('T')[0]);
                        }
                      }}
                      className="input-luxury-field"
                      required
                    />
                  </div>

                  {/* Check-Out */}
                  <div className="input-luxury-container">
                    <label className="input-luxury-label">
                      <Calendar className="h-3.5 w-3.5 text-primary-accent" /> Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="input-luxury-field"
                      required
                    />
                  </div>

                  {/* Guests */}
                  <div className="input-luxury-container">
                    <label className="input-luxury-label">
                      <Users className="h-3.5 w-3.5 text-primary-accent" /> Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="input-luxury-field cursor-pointer"
                    >
                      {['1', '2', '3', '4'].map((n) => (
                        <option key={n} value={n} className="bg-card text-foreground">{n} Guest{n !== '1' ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <button
                  type="submit"
                  className="btn-luxury-primary w-full"
                >
                  Check Availability <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Staggered Image Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-10 lg:mt-0">
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden border-[8px] border-card shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581850518616-bcb8077fa213?auto=format&fit=crop&q=80&w=800"
                alt="Chitwan National Park Wilderness"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Small overlapping image */}
            <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-[1.5rem] overflow-hidden border-8 border-card shadow-xl hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400"
                alt="Rapti River Crossing"
                fill
                className="object-cover"
              />
            </div>

            {/* Local Badge */}
            <div className="absolute -top-6 -right-6 bg-primary-accent text-white p-4 rounded-full shadow-lg hidden sm:flex flex-col items-center justify-center w-24 h-24 text-center leading-tight">
              <span className="text-micro uppercase font-bold tracking-widest">Sauraha</span>
              <span className="text-base font-bold">Local</span>
              <span className="text-nano uppercase font-bold tracking-widest">Guide</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── ROOMS & ACCOMMODATIONS ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-subtitle-tag mb-3">Simple, Cool, & Quiet Spaces</p>
            <h2 className="text-title-section">Our Cottage Rooms</h2>
            <div className="editorial-line"></div>
          </div>

          {hasSearched ? (
            <div className="alert-luxury alert-luxury-success items-center py-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Available for: <strong>{checkIn}</strong> to <strong>{checkOut}</strong></span>
              <button
                onClick={() => setHasSearched(false)}
                className="ml-2 underline text-primary-accent hover:opacity-80 transition-opacity font-bold uppercase tracking-wider text-micro"
              >
                Clear
              </button>
            </div>
          ) : (
            <Link href="/rooms" className="btn-luxury-link">
              Browse all sanctuaries <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoaded && roomTypes.map((room) => {
            const isAvailable = checkAvailability(room.id, checkIn, checkOut);
            const availableUnits = getAvailableCount(room.id, checkIn, checkOut);

            return (
              <div key={room.id} className="group card-luxury">
                
                {/* Photo & badges */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={room.photos[0]}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-foreground border border-border/40 shadow-sm">
                    NPR {room.price.toLocaleString()} <span className="font-normal text-muted">/ night</span>
                  </div>

                  {/* Availability Badge */}
                  {hasSearched && (
                    <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-micro uppercase tracking-wider font-bold shadow-md ${
                      isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {isAvailable ? `${availableUnits} Rooms Left` : 'Sold Out'}
                    </div>
                  )}
                </div>

                {/* Info & CTA */}
                <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-title-card group-hover:text-primary-accent transition-colors mb-2">
                      {room.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-muted leading-relaxed mb-5 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Clean bullet-free list of amenities */}
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((a, i) => (
                        <span key={i} className="badge-tag-luxury">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="badge-luxury py-1">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/rooms/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="btn-luxury-outline w-full text-center"
                  >
                    View Details & Book <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── NEW SECTION: CHITWAN EXPERIENCES (Storytelling) ── */}
      <section className="bg-primary-light/40 border-y border-border py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-subtitle-tag mb-3">Chitwan Through Local Eyes</p>
            <h2 className="text-title-section">Jungle & Village Life</h2>
            <div className="editorial-line mx-auto"></div>
            <p className="text-sm text-muted mt-4">
              We grew up walking these forest paths. We don't just book tours; we walk with you to introduce you to our neighbors in the Tharu village, and share the stories of the forest we call home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Jungle Walks',
                desc: 'Explore the national park with our veteran local guides to spot the great one-horned rhino and wild deer.',
                photo: 'https://images.unsplash.com/photo-1581850518616-bcb8077fa213?auto=format&fit=crop&q=80&w=400',
              },
              {
                title: 'Rapti Canoe Rides',
                desc: 'Drift down the Rapti River on a hand-carved wooden canoe as the sun dips below the jungle canopy, painting the water gold.',
                photo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400',
              },
              {
                title: 'Tharu Heritage',
                desc: 'Walk through nearby villages where mud-and-clay houses are decorated with ancient geometric murals.',
                photo: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400',
              },
              {
                title: 'Living with Nature',
                desc: 'We run our lodge consciously — using solar-heated water, composting organic waste, and serving vegetables from our garden.',
                photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
              },
            ].map((exp, idx) => (
              <div key={idx} className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary-accent transition-colors">
                <div className="relative h-44 w-full bg-muted-light">
                  <Image
                    src={exp.photo}
                    alt={exp.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-title-card mb-2">{exp.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOD & RESTAURANT ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-subtitle-tag mb-3">Ghar ko Khana</p>
            <h2 className="text-title-section">Fresh Meals from Our Family Kitchen</h2>
            <div className="editorial-line"></div>
          </div>
          
          <Link
            href="/food"
            className="btn-luxury-link"
          >
            <Utensils className="h-3.5 w-3.5" /> View Menu & Order
          </Link>
        </div>

        {/* Chalkboard Menu Card Teaser style layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Cozy Description Banner */}
          <div className="lg:col-span-4 bg-primary text-primary-light rounded-3xl p-8 sm:p-10 flex flex-col justify-between gap-10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <span className="text-micro uppercase font-bold tracking-widest text-primary-accent">Mitho Bhojan</span>
              <h3 className="text-2xl sm:text-3xl font-bold mt-4 mb-4 text-white">Traditional home cooking style</h3>
              <p className="text-xs text-primary-light/80 leading-relaxed font-normal">
                We prepare everything fresh using vegetables from our kitchen garden and local markets. Sit in our garden for a hot plate of Thakali Dal Bhat with local greens (Saag) and fresh tomato pickle (Golbheda ko Achar).
              </p>
            </div>

            <div className="relative z-10 border-t border-primary-light/20 pt-6">
              <p className="text-xs text-primary-accent font-bold uppercase tracking-widest mb-2">Room Service</p>
              <p className="text-mini text-primary-light/60">
                Staying in our cottages? Type in your room number in the cart to order hot food directly to your veranda.
              </p>
            </div>
          </div>

          {/* Right Column: Chalkboard Menu List Grid */}
          <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {isLoaded && featuredFood.map((item) => (
                <div key={item.id} className="flex gap-4 items-start group">
                  {item.image && (
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary-accent transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-primary shrink-0">
                        NPR {item.price}
                      </span>
                    </div>
                    <p className="text-mini text-muted line-clamp-2 mt-1 leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted font-medium">
                Want to taste authentic local thali, momos, or fresh beverages?
              </p>
              <Link
                href="/food"
                className="btn-luxury-primary py-3.5 px-6 shrink-0"
              >
                Go to Ordering Desk <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY US & BADGES ── */}
      <section className="bg-primary-light/20 border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Shield,
              title: 'Warm Nepalese Welcome',
              desc: 'From a hot cup of masala tea when you arrive to helping you plan your day, we treat you like family.',
            },
            {
              icon: Moon,
              title: 'Steps from the Rapti River',
              desc: 'We are located in a quiet green lane, just a 5-minute walk from the park entrance gate and river bank.',
            },
            {
              icon: Leaf,
              title: 'Honest, Fair Prices',
              desc: 'Book directly with us online and pay easily via eSewa, bank transfer, or cash when you check in.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-primary-accent shadow-sm">
                <Icon className="h-5 w-5 stroke-[1.5]" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
