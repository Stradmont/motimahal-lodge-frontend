'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@motimahal.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@motimahal.com' && password === 'admin123') {
        localStorage.setItem('motimahal_admin_auth', 'true');
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/contact');
        }, 400);
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. (Use admin@motimahal.com / admin123)');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-zinc-800 bg-zinc-900 rounded-sm p-6 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-8 h-8 rounded-sm bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-sm mx-auto mb-2">
            M
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Moti Mahal CMS
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to manage lodge content and inquiries
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-xs space-y-1 text-zinc-300">
          <p className="font-semibold text-zinc-200">Demo Credentials:</p>
          <p className="font-mono text-zinc-400">
            Email: admin@motimahal.com
            <br />
            Pass: admin123
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900/60 text-rose-300 rounded-sm p-3 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-sm p-3 text-xs">
            Authentication successful. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@motimahal.com"
              required
              className="bg-zinc-950 border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-zinc-950 border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium text-sm h-9"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="pt-3 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Back to Public Lodge Website
          </Link>
        </div>
      </div>
    </div>
  );
}
