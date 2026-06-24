'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Copy, Upload, AlertCircle, FileText, ChevronRight, Compass } from 'lucide-react';

interface PageProps {
  params: Promise<{ ref: string }>;
}

export default function BookingConfirmPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingRef = resolvedParams.ref;

  const router = useRouter();
  const { bookings, roomTypes, updatePaymentStatus, isLoaded } = useApp();

  // Find booking by referenceNumber
  const booking = bookings.find(b => b.referenceNumber === bookingRef);

  // eSewa / Bank details states
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Bank'>('eSewa');
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (isLoaded && !booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Booking Record Not Found</h2>
        <Link href="/" className="text-primary hover:underline flex items-center justify-center gap-1">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roomType = roomTypes.find(rt => rt.id === booking.roomTypeId);

  const getNumNights = () => {
    const d1 = new Date(booking.checkIn);
    const d2 = new Date(booking.checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNumNights();
  const roomPrice = roomType?.price || 0;
  const subtotal = roomPrice * nights;
  const vat = Math.round(subtotal * 0.13);
  const serviceCharge = Math.round(subtotal * 0.10);
  const total = subtotal + vat + serviceCharge;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock eSewa verification or Bank deposit submit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId) return;
    setSubmitting(true);

    setTimeout(() => {
      updatePaymentStatus(booking.id, 'Paid', {
        method: paymentMethod === 'eSewa' ? 'eSewa' : 'Bank Transfer',
        transactionId: txnId,
        screenshotUrl: screenshot || undefined
      });
      setSubmitting(false);
      setSuccessMsg('Your payment proof has been successfully submitted and verified! Enjoy your stay.');
    }, 1500);
  };

  // Handle mock screenshot file upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload with dummy local URL
      setScreenshot('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* 1. Confirmation Header */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Booking Received!</h1>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
              Namaste, <strong>{booking.guestName}</strong>! We have received your booking request. Please check your details below and complete payment to secure your room.
            </p>
          </div>
        </div>

        {/* Booking Token Card */}
        <div className="bg-muted-light border border-border rounded-2xl px-5 py-3.5 flex flex-col gap-1 items-center shrink-0 w-full sm:w-auto">
          <span className="text-micro text-muted uppercase tracking-wider font-semibold">Booking Code</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-base font-bold text-primary select-all">{booking.referenceNumber}</span>
            <button 
              onClick={handleCopyRef}
              className={`p-1.5 rounded-lg border border-border transition-all ${
                copied ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-background hover:bg-muted-light text-muted'
              }`}
              title="Copy Reference Number"
            >
              {copied ? (
                <span className="text-micro font-semibold px-0.5">Copied!</span>
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <span className="text-nano text-muted font-medium">Save this code to log into your guest portal to order food and check your booking status.</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Details vs Payment Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Receipt Breakdown */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Your Stay Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-micro text-muted uppercase tracking-wider font-semibold">Check-In Date</span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">{booking.checkIn}</span>
              </div>
              <div>
                <span className="text-micro text-muted uppercase tracking-wider font-semibold">Check-Out Date</span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">{booking.checkOut}</span>
              </div>
              <div>
                <span className="text-micro text-muted uppercase tracking-wider font-semibold">Cottage Type</span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">{roomType?.name}</span>
              </div>
              <div>
                <span className="text-micro text-muted uppercase tracking-wider font-semibold">Guests Count</span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">{booking.numGuests} Guest(s)</span>
              </div>
              <div className="col-span-2">
                <span className="text-micro text-muted uppercase tracking-wider font-semibold">Contact Phone</span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">{booking.guestPhone}</span>
              </div>
            </div>

            <div className="h-px bg-border/60 my-2"></div>

            {/* Receipt Table */}
            <div className="flex flex-col gap-2.5 text-xs text-muted">
              <div className="flex justify-between">
                <span>Room Charges ({nights} night{nights > 1 ? 's' : ''})</span>
                <span className="font-medium text-foreground">NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Hotel Service Charge (10%)</span>
                <span className="font-medium text-foreground">NPR {serviceCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (13%)</span>
                <span className="font-medium text-foreground">NPR {vat.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border/60 my-1"></div>
              <div className="flex justify-between text-sm text-foreground font-semibold">
                <span>Total Amount Due</span>
                <span className="text-primary font-bold text-base">NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex gap-2 items-center border-t border-border pt-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-nano text-muted uppercase tracking-wider font-semibold">Payment Status</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-nano font-bold border uppercase tracking-wider ${
                  booking.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : 'bg-amber-500/10 text-amber-800 border-amber-500/20'
                }`}>{booking.paymentStatus}</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-nano text-muted uppercase tracking-wider font-semibold">Booking Verification</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-nano font-bold border uppercase tracking-wider ${
                  booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : 'bg-blue-500/10 text-blue-800 border-blue-500/20'
                }`}>{booking.status}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: eSewa / Bank Gateways */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-border pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Payment Options</h3>
              <p className="text-micro text-muted leading-relaxed">Please send payment using eSewa or Bank Transfer to confirm your cottage booking.</p>
            </div>

            {booking.paymentStatus === 'Paid' ? (
              /* Already paid */
              <div className="py-10 text-center flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">Payment Confirmed!</h4>
                <p className="text-mini text-muted max-w-xs leading-relaxed">
                  Thank you! We have received your payment. Your booking is now confirmed, and we look forward to welcoming you to Sauraha.
                </p>
                <Link 
                  href="/dashboard?role=guest"
                  className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold py-2 px-6 rounded-xl shadow transition-all mt-2"
                >
                  Access Guest Portal
                </Link>
              </div>
            ) : (
              /* Gateway Selector */
              <div className="flex flex-col gap-5">
                {/* Tabs */}
                <div className="flex bg-muted-light p-1 rounded-xl border border-border">
                  <button 
                    onClick={() => setPaymentMethod('eSewa')}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'eSewa' ? 'bg-primary text-primary-light' : 'text-muted'
                    }`}
                  >
                    eSewa Wallet Transfer
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('Bank')}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'Bank' ? 'bg-primary text-primary-light' : 'text-muted'
                    }`}
                  >
                    Direct Bank Deposit
                  </button>
                </div>

                {/* Gateway Detail Boards */}
                {paymentMethod === 'eSewa' ? (
                  <div className="bg-primary-light/50 border border-primary-accent/40 p-4 rounded-2xl flex flex-col gap-2.5 text-xs text-muted leading-relaxed">
                    <span className="font-semibold text-primary block uppercase tracking-wider text-nano">eSewa Merchant Details:</span>
                    <div>
                      <span className="font-bold text-foreground">eSewa ID / Mobile:</span> 9845012345
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Account Holder:</span> Motimahal Lodge Pvt. Ltd.
                    </div>
                    <span className="text-micro font-medium text-primary-accent/90">Please send NPR {total.toLocaleString()} to this number. After transfer, type the 10-digit Transaction ID below to verify.</span>
                  </div>
                ) : (
                  <div className="bg-primary-light/50 border border-primary-accent/40 p-4 rounded-2xl flex flex-col gap-2 text-xs text-muted leading-relaxed">
                    <span className="font-semibold text-primary block uppercase tracking-wider text-nano">Direct Deposit Info:</span>
                    <div>
                      <span className="font-bold text-foreground">Bank Name:</span> Nabil Bank Ltd. (Sauraha Branch)
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Account Name:</span> Motimahal Lodge Pvt. Ltd.
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Account Number:</span> 01234567890123
                    </div>
                    <span className="text-micro font-medium text-primary-accent/90">Please deposit NPR {total.toLocaleString()} to this account. Enter the transaction reference below to verify.</span>
                  </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-micro text-muted font-bold uppercase tracking-wider">
                      {paymentMethod === 'eSewa' ? '10-Digit eSewa txn ID' : 'Bank Reference Number'}
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. TXN98765432"
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-foreground font-mono w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-micro text-muted font-bold uppercase tracking-wider">Upload Receipt Screenshot (optional)</label>
                    <div className="relative border border-dashed border-border/80 hover:border-primary/50 bg-muted-light/60 p-4 rounded-xl text-center cursor-pointer transition-colors">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="h-5 w-5 text-muted/60 mx-auto mb-1" />
                      <span className="text-micro text-muted font-medium block">
                        {screenshot ? 'Screenshot Attached ✓' : 'Drag & drop or browse image file'}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting || !txnId}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-light py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md mt-1 disabled:opacity-50"
                  >
                    {submitting ? 'Verifying payment...' : `Verify Payment of NPR ${total.toLocaleString()}`}
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
