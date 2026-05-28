'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../../../../context/AppContext';
import { CheckCircle2, Copy, Upload, AlertCircle, FileText, ChevronRight, Compass } from 'lucide-react';

interface PageProps {
  params: Promise<{ ref: string }>;
}

export default function BookingConfirmPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingRef = resolvedParams.ref;

  const { bookings, roomTypes, updatePaymentStatus, isLoaded } = useApp();
  
  // Local interface states
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showEsewaModal, setShowEsewaModal] = useState(false);
  
  // eSewa simulation form states
  const [esewaId, setEsewaId] = useState('');
  const [esewaPin, setEsewaPin] = useState('');
  const [esewaOtp, setEsewaOtp] = useState('');
  const [esewaStep, setEsewaStep] = useState(1); // 1 = Creds, 2 = OTP, 3 = Success
  const [paying, setPaying] = useState(false);

  // Find booking
  const booking = bookings.find(b => b.referenceNumber === bookingRef);

  if (isLoaded && !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Booking Not Found</h2>
        <p className="text-muted mb-6">We couldn't locate any reservation matching the reference {bookingRef}.</p>
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
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
  const roomPrice = roomType ? roomType.price : 0;
  const subtotal = roomPrice * nights;
  const vat = Math.round(subtotal * 0.13);
  const serviceCharge = Math.round(subtotal * 0.10);
  const totalAmount = subtotal + vat + serviceCharge;

  // Copy reference number
  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      // Simulate file upload delay
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(e.target.files![0]);
        setScreenshot(fileUrl);
        setUploading(false);
        updatePaymentStatus(booking.id, 'Pending', {
          method: 'Bank Transfer',
          screenshotUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400' // mock link
        });
      }, 1500);
    }
  };

  // eSewa payment flow simulation
  const handleEsewaSubmitCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esewaId || !esewaPin) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setEsewaStep(2); // move to OTP
    }, 1200);
  };

  const handleEsewaSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esewaOtp) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setEsewaStep(3); // success
      updatePaymentStatus(booking.id, 'Paid', {
        method: 'eSewa',
        transactionId: `TXN-ESEWA-${Math.floor(100000 + Math.random() * 900000)}`
      });
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl text-center flex flex-col items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">Booking Received!</h1>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Your reservation has been recorded successfully. Please complete the payment to secure your rooms.
          </p>
        </div>

        {/* Ref box */}
        <div className="flex items-center gap-2 bg-muted-light border border-border px-4 py-2 rounded-2xl mt-2 select-all">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Booking Ref:</span>
          <span className="text-sm font-bold text-primary font-mono">{booking.referenceNumber}</span>
          <button 
            onClick={handleCopyRef}
            className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-border/60"
            title="Copy reference code"
          >
            {copied ? <span className="text-xs text-emerald-600 font-medium">Copied!</span> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Summary of stay */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">Stay Details</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted block mb-0.5">Guest Name</span>
                <span className="font-medium">{booking.guestName}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-0.5">Phone Number</span>
                <span className="font-medium font-mono">{booking.guestPhone}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-0.5">Check-In</span>
                <span className="font-medium">{booking.checkIn}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-0.5">Check-Out</span>
                <span className="font-medium">{booking.checkOut}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-0.5">Room Category</span>
                <span className="font-medium">{roomType?.name}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-0.5">Nights & Guests</span>
                <span className="font-medium">{nights} Night{nights > 1 ? 's' : ''} / {booking.numGuests} Guest{booking.numGuests > 1 ? 's' : ''}</span>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-muted-light p-3.5 rounded-xl text-xs text-muted border border-border/50 mt-2">
                <strong>Guest Note:</strong> {booking.notes}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-md flex flex-col gap-3">
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">Pricing Details</h2>
            
            <div className="flex justify-between text-sm text-muted">
              <span>Room Rent (NPR {roomPrice.toLocaleString()} x {nights})</span>
              <span>NPR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Service Charge (10%)</span>
              <span>NPR {serviceCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>VAT (13%)</span>
              <span>NPR {vat.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-1"></div>
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Total Amount</span>
              <span className="text-primary">NPR {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Options */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Status Indicator */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-md">
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider mb-4">Payment Status</h2>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                booking.paymentStatus === 'Paid'
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                  : booking.paymentDetails.screenshotUrl
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                    : 'bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20'
              }`}>
                {booking.paymentStatus === 'Paid' 
                  ? 'Paid (Verified)' 
                  : booking.paymentDetails.screenshotUrl 
                    ? 'Pending Verification' 
                    : 'Unpaid / Pending'}
              </span>
              
              <span className="text-xs text-muted">
                Via {booking.paymentDetails.method || 'None'}
              </span>
            </div>

            {booking.paymentStatus === 'Paid' && (
              <div className="mt-4 p-3 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 border border-emerald-500/10 rounded-xl text-xs flex flex-col gap-1">
                <span><strong>Transaction ID:</strong> {booking.paymentDetails.transactionId}</span>
                <span><strong>Verified at:</strong> {new Date(booking.paymentDetails.verifiedAt || '').toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Action Boxes */}
          {booking.paymentStatus !== 'Paid' && (
            <div className="flex flex-col gap-4">
              
              {/* Option A: eSewa (Automated) */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-md hover:border-emerald-500/40 transition-colors flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-[#60bb46] text-white font-bold text-xs">
                      eSewa
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">Instant Payment</h3>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">Automated</span>
                </div>
                
                <p className="text-xs text-muted leading-relaxed">
                  Pay directly via eSewa merchant portal. Your booking will be instantly confirmed upon payment.
                </p>

                <button 
                  onClick={() => {
                    setEsewaStep(1);
                    setShowEsewaModal(true);
                  }}
                  className="w-full bg-[#60bb46] hover:bg-[#52a13b] text-white font-medium text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Pay with eSewa</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Option B: Bank Transfer (Manual Screenshot Upload) */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Bank Transfer</h3>
                  <span className="text-[10px] uppercase font-semibold text-amber-600 tracking-wider">Manual Review</span>
                </div>

                <div className="bg-muted-light p-3 rounded-2xl text-[11px] text-muted flex flex-col gap-1 border border-border/80 font-mono">
                  <div><strong>Bank:</strong> Rastriya Banijya Bank</div>
                  <div><strong>Account Name:</strong> Motimahal Lodge Pvt. Ltd.</div>
                  <div><strong>Account Number:</strong> 109012345678901</div>
                  <div><strong>Branch:</strong> Sauraha, Chitwan</div>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  Transfer the exact amount to the bank account and upload a clear screenshot of the receipt.
                </p>

                {/* Screenshot Upload widget */}
                <div className="flex flex-col gap-2">
                  {booking.paymentDetails.screenshotUrl ? (
                    <div className="p-3 bg-amber-500/5 text-amber-800 dark:text-amber-300 border border-amber-500/10 rounded-xl text-xs flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="truncate">Screenshot uploaded for review</span>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/50 transition-colors py-4 rounded-xl cursor-pointer bg-muted-light text-center">
                      <Upload className="h-5 w-5 text-muted" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">{uploading ? 'Uploading...' : 'Choose receipt image'}</span>
                        <span className="text-[10px] text-muted mt-0.5">JPG, PNG (Max 5MB)</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleScreenshotUpload}
                        disabled={uploading}
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Portal Direct Access */}
          <div className="bg-primary-light border border-primary-accent/40 rounded-3xl p-6 shadow-md flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-primary">Access Guest Portal</h3>
            <p className="text-xs text-muted leading-relaxed">
              Once checked in, log in to the guest portal using your reference number and phone to order delicious food directly to your room!
            </p>
            <Link 
              href="/portal"
              className="inline-flex items-center justify-center gap-1 bg-primary text-primary-light hover:bg-primary/95 text-xs py-2.5 rounded-xl font-medium transition-all"
            >
              <span>Go to Guest Portal</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Simulated eSewa Checkout Modal */}
      {showEsewaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
            {/* Modal Header */}
            <div className="bg-[#60bb46] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5">
                <Compass className="h-5 w-5 text-white" />
                <span className="font-bold text-sm tracking-wide font-mono">eSewa Checkout</span>
              </div>
              <button 
                onClick={() => setShowEsewaModal(false)}
                className="text-white hover:text-zinc-100 text-sm font-medium font-mono"
              >
                Cancel
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              
              {esewaStep === 1 && (
                <form onSubmit={handleEsewaSubmitCreds} className="flex flex-col gap-4">
                  <div className="text-center mb-2">
                    <span className="text-xs text-zinc-500 font-medium">Merchant: Motimahal Lodge</span>
                    <h3 className="text-lg font-bold text-zinc-800 mt-0.5">NPR {totalAmount.toLocaleString()}</h3>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">eSewa ID (Mobile Number)</label>
                    <input 
                      type="text" 
                      placeholder="98XXXXXXXX"
                      value={esewaId}
                      onChange={(e) => setEsewaId(e.target.value)}
                      className="border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:border-[#60bb46] focus:outline-none w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">MPIN / Password</label>
                    <input 
                      type="password" 
                      placeholder="XXXX"
                      maxLength={4}
                      value={esewaPin}
                      onChange={(e) => setEsewaPin(e.target.value)}
                      className="border border-zinc-300 rounded-xl px-3 py-2 text-sm focus:border-[#60bb46] focus:outline-none w-full"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={paying}
                    className="w-full bg-[#60bb46] hover:bg-[#52a13b] text-white font-medium text-xs py-3 rounded-xl transition-all mt-2"
                  >
                    {paying ? 'Connecting to eSewa...' : 'Login & Continue'}
                  </button>
                </form>
              )}

              {esewaStep === 2 && (
                <form onSubmit={handleEsewaSubmitOtp} className="flex flex-col gap-4">
                  <div className="text-center mb-2">
                    <span className="text-xs text-zinc-500">Security Verification</span>
                    <h3 className="text-base font-bold text-zinc-800 mt-0.5">Enter OTP Code</h3>
                    <p className="text-[10px] text-zinc-400 mt-1">An SMS verification code has been simulated to {esewaId}.</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">One Time Password (OTP)</label>
                    <input 
                      type="text" 
                      placeholder="123456"
                      value={esewaOtp}
                      onChange={(e) => setEsewaOtp(e.target.value)}
                      className="border border-zinc-300 rounded-xl px-3 py-2 text-sm text-center font-bold tracking-widest focus:border-[#60bb46] focus:outline-none w-full"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={paying}
                    className="w-full bg-[#60bb46] hover:bg-[#52a13b] text-white font-medium text-xs py-3 rounded-xl transition-all mt-2"
                  >
                    {paying ? 'Verifying payment...' : 'Confirm Payment'}
                  </button>
                </form>
              )}

              {esewaStep === 3 && (
                <div className="text-center py-6 flex flex-col items-center gap-4 animate-fade-in">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800">Payment Successful!</h3>
                    <p className="text-xs text-zinc-500 mt-1">Your transaction has been processed successfully.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowEsewaModal(false);
                      setEsewaStep(1);
                    }}
                    className="bg-zinc-800 hover:bg-zinc-950 text-white font-medium text-xs px-6 py-2 rounded-xl transition-all mt-2"
                  >
                    Return to Lodge Site
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
