'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const PERKS = [
  'Order food directly to your cottage room',
  'Submit housekeeping & maintenance requests',
  'View real-time order status and history',
  'Access your complete stay booking details',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm)  { setError('Passwords do not match.');              return; }
    if (password.length < 6)   { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { success, error: err } = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!success) { setError(err ?? 'Registration failed.'); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Compass className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-white font-semibold text-base leading-tight">Motimahal Lodge</p>
            <p className="text-white/60 text-[10px] uppercase tracking-wider">Sauraha, Chitwan</p>
          </div>
        </div>

        {/* Tagline + perks */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-white text-3xl font-semibold leading-snug">
              Your stay,<br />your way.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mt-3">
              Create a free guest account to unlock the full in-stay experience at Motimahal Lodge, Chitwan.
            </p>
          </div>
          <ul className="space-y-3">
            {PERKS.map(perk => (
              <li key={perk} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                <span className="text-white/80 text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign-in link */}
        <div className="relative z-10 border border-white/20 rounded-2xl px-4 py-3">
          <p className="text-white/60 text-xs">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Sign in instead →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: register form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-light">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">Motimahal Lodge</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">Guest Registration</p>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Create account</h1>
            <p className="text-sm text-muted mt-1">
              Already registered?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted/60" />
                <input
                  type="text"
                  placeholder="e.g. Anil Gurung"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  className="w-full bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground transition-all"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted/60" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  className="w-full bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted/60" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground transition-all"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-3 text-muted hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted/60" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                  className="w-full bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground transition-all"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-light font-semibold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <UserPlus className="h-4 w-4" />}
              {loading ? 'Creating account…' : 'Create guest account'}
            </button>
          </form>

          <p className="text-[10px] text-muted text-center leading-relaxed">
            This account gives access to the <strong>Guest Portal</strong> only.
            Staff accounts are managed by lodge administration.
          </p>

        </div>
      </div>
    </div>
  );
}
