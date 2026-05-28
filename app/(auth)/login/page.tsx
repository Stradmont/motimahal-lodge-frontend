'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

const DEMO_CREDENTIALS = [
  { role: '💼 Staff Admin',  email: 'admin@motimahal.com',   password: 'admin1234'   },
  { role: '🍳 Kitchen Crew', email: 'kitchen@motimahal.com', password: 'kitchen1234' },
  { role: '🔑 Guest Demo',   email: 'guest@demo.com',        password: 'guest1234'   },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { success, error: err } = await login(email.trim(), password);
    setLoading(false);
    if (!success) { setError(err ?? 'Login failed.'); return; }
    router.push('/dashboard');
  };

  const fillDemo = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left decorative panel (desktop) ── */}
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

        {/* Tagline */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-3xl font-semibold leading-snug">
            Welcome to the<br />Workspace Portal
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Manage reservations, room-service orders, and guest experiences — all from one unified dashboard.
          </p>
        </div>

        {/* Demo credential cards */}
        <div className="relative z-10 space-y-2">
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold mb-3">Demo Accounts</p>
          {DEMO_CREDENTIALS.map(cred => (
            <button
              key={cred.email}
              onClick={() => fillDemo(cred)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-4 py-3 transition-all group"
            >
              <div className="flex flex-col items-start">
                <span className="text-white text-xs font-semibold">{cred.role}</span>
                <span className="text-white/50 text-[10px] font-mono">{cred.email}</span>
              </div>
              <span className="text-white/40 text-[10px] group-hover:text-white/70 transition-colors">
                Click to fill →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-light">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">Motimahal Lodge</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">Workspace Portal</p>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Sign in</h1>
            <p className="text-sm text-muted mt-1">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register as a guest
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">
                Email address
              </label>
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
              <label className="text-[11px] text-muted font-semibold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted/60" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground transition-all"
                  required
                  autoComplete="current-password"
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
                : <LogIn className="h-4 w-4" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Mobile demo hint */}
          <div className="lg:hidden border border-border rounded-2xl p-4 space-y-2">
            <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">Demo credentials</p>
            {DEMO_CREDENTIALS.map(cred => (
              <button
                key={cred.email}
                onClick={() => fillDemo(cred)}
                className="w-full flex justify-between items-center hover:bg-muted-light rounded-xl px-3 py-2 transition-all"
              >
                <span className="text-xs font-medium text-foreground">{cred.role}</span>
                <span className="text-[10px] font-mono text-muted">{cred.password}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
