'use client';

import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Map, Bus, Plane, Car, MessageSquare, Compass
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
    <div className="flex flex-col flex-1">
      {/* Header Banner */}
      <section className="relative bg-hero text-primary-light py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-4xl z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light/10 text-primary-accent text-xs font-medium tracking-wide uppercase border border-primary-accent/20 mb-4">
            <Compass className="h-3 w-3 animate-spin-slow" /> Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4 text-foreground">
            Contact <span className="text-primary-accent font-semibold">Our Lodge</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto font-normal leading-relaxed">
            Have questions about room rates, jungle safari packages, or looking to book a custom family tour? Reach out, and our team in Sauraha will assist you.
          </p>
        </div>
      </section>

      {/* Main Form and details grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact details & Travel Guide */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Info Card Grid */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <span>Contact Information</span>
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/30">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Our Address</h4>
                  <p className="text-sm font-medium text-foreground mt-0.5">Sauraha, Chitwan, Nepal</p>
                  <p className="text-xs text-muted mt-0.5">Next to Chitwan National Park Entrance Gate</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/30">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Phone & Mobile</h4>
                  <p className="text-sm font-medium text-foreground mt-0.5">+977 56 580123 (Reception)</p>
                  <p className="text-xs text-muted mt-0.5">+977 9845012345 / 9812987654</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary border border-primary-accent/30">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Email Inquiry</h4>
                  <p className="text-sm font-medium text-foreground mt-0.5">stay@motimahallodge.com</p>
                  <p className="text-xs text-muted mt-0.5">info@motimahallodge.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Travel Guide Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <span>Getting to Sauraha</span>
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Bus className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold text-foreground">By Tourist Bus:</span> Daily tourist buses leave Kathmandu (Sorhakhutte) and Pokhara (Lakeside) at 7:00 AM, arriving in Sauraha, Chitwan in 6-7 hours. We offer free pickup from the Sauraha bus park!
                </div>
              </div>

              <div className="flex gap-3">
                <Plane className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold text-foreground">By Air:</span> Take a 25-minute domestic flight from Kathmandu (TIA) to Bharatpur Airport. From Bharatpur, it is a scenic 30-minute private taxi ride to our lodge in Sauraha.
                </div>
              </div>

              <div className="flex gap-3">
                <Car className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold text-foreground">By Private Taxi/Cab:</span> Hire a direct private vehicle from Kathmandu or Pokhara. Drive through the beautiful Trishuli river highway (Prithvi highway) straight to Chitwan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Message Form & Map */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Contact Message Form */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
            {formSubmitted ? (
              /* Success Animation Screen */
              <div className="text-center py-12 flex flex-col items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Message Sent Successfully!</h2>
                  <p className="text-xs text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting Motimahal Lodge, <strong>{name}</strong>. Our front desk staff in Sauraha will review your message and reply via email (<strong>{email}</strong>) within 24 hours.
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="bg-primary hover:bg-primary/95 text-primary-light px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Message Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Send us a Message</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Anil Gurung"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-foreground w-full transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. anil@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-foreground w-full transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jungle Safari Packages or Group Rates"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-foreground w-full transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Message Description</label>
                  <textarea 
                    placeholder="Describe your questions or requirements here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-foreground w-full resize-none transition-all"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/95 text-primary-light py-3.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
                >
                  <span>Submit Inquiry</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Interactive OpenStreetMap Map Card */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col h-80">
            {/* Styled Map frame pointing to Sauraha coordinates */}
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=84.475%2C27.568%2C84.495%2C27.585&amp;layer=mapnik&amp;marker=27.5768%2C84.4852"
              className="w-full h-full border-0 select-none"
              title="Motimahal Lodge location in Sauraha, Chitwan, Nepal"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
