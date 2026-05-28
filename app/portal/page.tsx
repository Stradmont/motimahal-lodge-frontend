'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { LogIn, Key, Phone, Calendar, User, Clock, CheckCircle2, Utensils, Sparkles, LogOut, ArrowRight, HelpCircle } from 'lucide-react';

export default function GuestPortalPage() {
  const { currentBooking, currentRoomNumber, loginGuest, logoutGuest, orders, roomTypes, isLoaded } = useApp();

  // Login form states
  const [refNum, setRefNum] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Service request state simulation
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginGuest(refNum, phone);
    if (!success) {
      setError('Invalid reference number or phone number. Try MM-2026-0001 & 9841234567.');
    }
  };

  const handleServiceRequest = (service: string) => {
    setRequestStatus(`Request for "${service}" has been sent to the front desk. Staff will be at Room ${currentRoomNumber} shortly!`);
    setTimeout(() => setRequestStatus(null), 5000);
  };

  // Find booking room type details
  const roomType = currentBooking ? roomTypes.find(rt => rt.id === currentBooking.roomTypeId) : null;

  // Filter food orders for this booking ref
  const guestOrders = currentBooking 
    ? orders.filter(o => o.bookingRef === currentBooking.referenceNumber)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center">
      
      {/* 1. Login State */}
      {isLoaded && !currentBooking ? (
        <div className="max-w-md w-full mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium text-foreground">Guest Portal</h1>
            <p className="text-xs text-muted mt-2">
              Log in with your booking details to access room service, order food, and view active stays.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3 w-3 text-primary" /> Booking Reference
              </label>
              <input 
                type="text" 
                placeholder="e.g. MM-2026-0001"
                value={refNum}
                onChange={(e) => setRefNum(e.target.value)}
                className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-2.5 text-sm text-foreground w-full font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3 w-3 text-primary" /> Phone Number
              </label>
              <input 
                type="text" 
                placeholder="e.g. 9841234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-2.5 text-sm text-foreground w-full font-mono"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-800 dark:text-red-300 border border-red-500/20 rounded-xl text-xs">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-light font-medium text-sm py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span>Enter Guest Portal</span>
            </button>
          </form>

          {/* Hint Card */}
          <div className="bg-primary-light border border-primary-accent/40 rounded-2xl p-4 mt-6 text-xs text-muted leading-relaxed">
            <strong>Simulation Hint:</strong> Use pre-seeded check-in booking:
            <div className="font-mono mt-1 text-[11px] text-foreground">
              Reference: <span className="font-bold">MM-2026-0001</span><br />
              Phone: <span className="font-bold">9841234567</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* 2. Logged In Portal Dashboard */}
      {isLoaded && currentBooking ? (
        <div className="flex flex-col gap-8">
          
          {/* Welcome Dashboard Banner */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary border border-primary-accent/40">
                <User className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-primary font-medium">Welcome back,</span>
                <h1 className="text-2xl font-medium text-foreground">{currentBooking.guestName}</h1>
                <p className="text-xs text-muted mt-0.5">Staying in Room {currentRoomNumber} ({roomType?.name})</p>
              </div>
            </div>

            <button 
              onClick={logoutGuest}
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted-light text-muted hover:text-foreground text-xs font-medium transition-all flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>

          {/* Floating Request Alert Toast */}
          {requestStatus && (
            <div className="p-4 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 rounded-2xl text-xs font-medium animate-pulse">
              {requestStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Quick Actions & Stay Overview */}
            <div className="md:col-span-6 flex flex-col gap-6">
              
              {/* Stay Dates Info */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Booking Status</h2>
                
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                    currentBooking.status === 'CheckedIn'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                  }`}>
                    {currentBooking.status}
                  </span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs text-muted">Ref: {currentBooking.referenceNumber}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <span className="text-muted block">Check-in Date</span>
                    <span className="font-semibold">{currentBooking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Check-out Date</span>
                    <span className="font-semibold">{currentBooking.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Service Requests Board */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Room Requests</h2>
                <p className="text-xs text-muted">Submit housekeeping, towels, or support requests with a single click.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleServiceRequest('Clean Room / Housekeeping')}
                    className="p-3 bg-muted-light border border-border hover:border-primary/50 text-left rounded-2xl transition-all"
                  >
                    <Sparkles className="h-4 w-4 text-primary mb-2" />
                    <h3 className="text-xs font-semibold">Housekeeping</h3>
                    <span className="text-[10px] text-muted">Clean Room</span>
                  </button>

                  <button 
                    onClick={() => handleServiceRequest('Extra Towels / Toiletries')}
                    className="p-3 bg-muted-light border border-border hover:border-primary/50 text-left rounded-2xl transition-all"
                  >
                    <Clock className="h-4 w-4 text-primary mb-2" />
                    <h3 className="text-xs font-semibold">Extra Towels</h3>
                    <span className="text-[10px] text-muted">Bath toiletries</span>
                  </button>
                </div>

                <button 
                  onClick={() => handleServiceRequest('Express Checkout Request')}
                  className="w-full text-center py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-light text-xs font-medium transition-all mt-2"
                >
                  Request Express Checkout
                </button>
              </div>

            </div>

            {/* Right: In-room Food Ordering & Live Status */}
            <div className="md:col-span-6 flex flex-col gap-6">
              
              {/* Dining Promo banner */}
              <div className="bg-hero text-primary-light border border-primary-accent/15 rounded-3xl p-6 shadow-md flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center"></div>
                <div className="relative">
                  <span className="text-[10px] uppercase font-semibold text-primary-accent tracking-wider flex items-center gap-1 mb-1">
                    <Utensils className="h-3 w-3" /> Digital Room Service
                  </span>
                  <h3 className="text-lg font-medium">Order Food to Room {currentRoomNumber}</h3>
                  <p className="text-xs text-muted-light/60 mt-1 leading-relaxed">
                    Browse our full restaurant kitchen menu. Freshly steamed momos, snacks, and traditional sets delivered directly to your room.
                  </p>
                  
                  <Link 
                    href="/portal/order"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-light hover:bg-primary/90 text-xs font-medium transition-all shadow-md mt-4"
                  >
                    <span>Browse Menu</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Active Orders Status Feed */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Active & Past Orders</h2>
                
                {guestOrders.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted">
                    No food orders placed yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                    {guestOrders.map((order) => (
                      <div key={order.id} className="border border-border p-3.5 rounded-2xl flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-muted">Order #{order.id.slice(-4).toUpperCase()}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                              : order.status === 'Preparing'
                                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="flex flex-col gap-1 border-t border-border/40 pt-2 text-muted">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.name} <strong className="text-foreground">x{item.quantity}</strong></span>
                              <span>NPR {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="h-px bg-border/40 my-0.5"></div>

                        <div className="flex justify-between items-center text-foreground font-semibold">
                          <span className="text-[10px] text-muted">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>Total: NPR {order.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
