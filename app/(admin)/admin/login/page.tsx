'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password is required' }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, { message: 'Must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'Numbers only' }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { user, login, verifyOtp, resendOtp, otpChallenge, cancelOtp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/admin/contact');
  }, [user, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpChallenge) {
      setResendCooldown(60);
      setCanResend(false);
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [otpChallenge?.challengeId, otpChallenge]);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@motimahal.com', password: 'admin123' },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue: setOtpValue,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      if (!res.success) toast.error(res.message || 'Invalid credentials.');
    } catch {
      toast.error('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);
    try {
      const res = await verifyOtp(data.otp);
      if (res.success) {
        window.location.replace('/admin');
      } else {
        toast.error(res.message || 'Invalid verification code.');
      }
    } catch {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await resendOtp();
      if (res.success) {
        setResendCooldown(60);
        setCanResend(false);
        setOtpValue('otp', '');
        toast.success('New code sent to your email.');
      } else {
        toast.error(res.message || 'Could not resend code.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px]">

        {/* Header */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/logo.png"
            alt="Moti Mahal"
            className="w-12 h-12 mx-auto mb-4 rounded-lg object-contain"
          />
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">
            {otpChallenge ? 'Verify Your Identity' : 'Moti Mahal'}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {otpChallenge
              ? `Enter the 6-digit code sent to ${otpChallenge.email}`
              : 'Sign in to the admin portal'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-sm">

          {otpChallenge ? (
            /* ── Step 2: OTP ── */
            <form
              onSubmit={handleSubmitOtp(onOtpSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* OTP input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#334155]">
                    Verification Code
                  </label>
                  <span className="text-[11px] text-[#94A3B8]">6 digits · expires in 5 min</span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  autoComplete="one-time-code"
                  {...registerOtp('otp')}
                  disabled={isSubmitting}
                  placeholder="– – – – – –"
                  className={`w-full h-11 rounded-lg border px-4 text-center font-mono text-xl tracking-[0.4em] text-[#0F172A] placeholder:tracking-widest placeholder:text-[#CBD5E1] placeholder:text-base bg-white transition-colors outline-none
                    ${otpErrors.otp
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100'
                    } disabled:opacity-50`}
                />
                {otpErrors.otp && (
                  <p className="text-xs text-red-500 mt-1">{otpErrors.otp.message}</p>
                )}
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Verifying…
                  </span>
                ) : 'Verify & Continue'}
              </button>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={cancelOtp}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isSubmitting}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors
                    ${canResend && !isSubmitting
                      ? 'text-[#C88A3B] hover:text-[#b07830] cursor-pointer'
                      : 'text-[#94A3B8] cursor-not-allowed'
                    }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  {canResend ? 'Resend code' : `Resend in ${resendCooldown}s`}
                </button>
              </div>
            </form>
          ) : (
            /* ── Step 1: Email + Password ── */
            <form
              onSubmit={handleSubmitLogin(onLoginSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...registerLogin('email')}
                  disabled={isSubmitting}
                  placeholder="admin@motimahal.com"
                  className={`w-full h-10 rounded-lg border px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-white transition-colors outline-none
                    ${loginErrors.email
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100'
                    } disabled:opacity-50`}
                />
                {loginErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...registerLogin('password')}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className={`w-full h-10 rounded-lg border px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] bg-white transition-colors outline-none
                    ${loginErrors.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100'
                    } disabled:opacity-50`}
                />
                {loginErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#94A3B8] mt-5">
          Two-factor authentication is required for all admin accounts.
        </p>
      </div>
    </div>
  );
}
