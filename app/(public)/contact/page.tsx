'use client';

import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Map, Bus, Plane, Car, MessageSquare, Compass, Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate standard submission
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setFormSubmitted(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Header Banner */}
      <section className="banner-luxury">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative max-w-4xl z-10">
          <span className="badge-luxury mb-4">
            <Compass className="h-3.5 w-3.5" /> Namaste
          </span>
          <h1 className="text-title-section mb-4">
            Reach Out to Our Family
          </h1>
          <div className="editorial-line mx-auto"></div>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed mt-4">
            Have questions about room availability, dining at our restaurant, or finding the lodge? Send us a message, and we will get back to you personally.
          </p>
        </div>
      </section>

      {/* Main Form and details grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact details & Travel Guide */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Info Card Grid */}
          <div className="card-luxury p-6 sm:p-8 flex flex-col gap-6">
            <h2 className="text-title-card border-b border-border pb-3 flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary-accent" />
              <span>Contact Information</span>
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/20 shadow-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Our Address</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">New Road, Bharatpur, Chitwan, Nepal</p>
                  <p className="text-xs text-muted mt-0.5">Beside the Narayani River, 900 meters from Pulchowk</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/20 shadow-sm">
                  <Phone className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone & Mobile</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">+977 56 580123 (Reception)</p>
                  <p className="text-xs text-muted mt-0.5">+977 9845012345 / 9812987654</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/20 shadow-sm">
                  <Mail className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Inquiry</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">stay@motimahallodge.com</p>
                  <p className="text-xs text-muted mt-0.5">info@motimahallodge.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Guide Panel */}
          <div className="card-luxury p-6 sm:p-8 flex flex-col gap-5">
            <h2 className="text-title-card border-b border-border pb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary-accent" />
              <span>Getting to Bharatpur</span>
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <Bus className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-muted">
                  <span className="font-bold text-foreground block mb-0.5">By Tourist Bus:</span> Tourist buses leave Kathmandu (Sorhakhutte) and Pokhara (Lakeside) every morning at 7:00 AM. The journey takes about 5-6 hours to reach Narayanghat / Bharatpur. Let us know your bus company, and we can arrange pick-up from the station!
                </div>
              </div>

              <div className="flex gap-3">
                <Plane className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-muted">
                  <span className="font-bold text-foreground block mb-0.5">By Domestic Flight:</span> You can take a quick 25-minute flight from Kathmandu to Bharatpur Airport. From there, it is just a 10-minute taxi ride to our lodge in New Road. Let us know, and we can arrange a pickup.
                </div>
              </div>

              <div className="flex gap-3">
                <Car className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-muted">
                  <span className="font-bold text-foreground block mb-0.5">By Private Vehicle:</span> If you prefer driving, you can hire a private car from Kathmandu or Pokhara. The drive takes you along the scenic Trishuli River highway (Prithvi Highway) and down into the flat plains of Chitwan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Message Form & Map */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Contact Message Form */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md">
            {formSubmitted ? (
              /* Success Screen */
              <div className="text-center py-12 flex flex-col items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-title-card text-xl">Message Sent!</h2>
                  <p className="text-xs text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for writing to us, <strong>{name}</strong>. Our family will read your message and reply to you at <strong>{email}</strong> within a few hours.
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="btn-luxury-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Message Form inputs */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <MessageSquare className="h-5 w-5 text-primary-accent" />
                  <h2 className="text-title-card">Write to Us</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="input-luxury-container">
                    <label className="input-luxury-label">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Anil Gurung"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-luxury-field"
                      required
                    />
                  </div>

                  <div className="input-luxury-container">
                    <label className="input-luxury-label">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="anil@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-luxury-field"
                      required
                    />
                  </div>
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Jungle Safari Packages, Group Rates, etc."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-luxury-field"
                    required
                  />
                </div>

                <div className="input-luxury-container">
                  <label className="input-luxury-label">Your Message</label>
                  <textarea 
                    placeholder="Write down any questions about rooms, safaris, or food..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="input-luxury-field resize-none h-24"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="btn-luxury-primary w-full mt-2"
                >
                  <span>Send Message</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Map Card */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col h-80">
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=84.407%2C27.688%2C84.427%2C27.705&amp;layer=mapnik&amp;marker=27.6975%2C84.4172"
              className="w-full h-full border-0 select-none"
              title="Motimahal Lodge location in Bharatpur, Chitwan, Nepal"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
