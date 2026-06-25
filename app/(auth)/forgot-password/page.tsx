'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, CheckCircle2, KeyRound, Copy, Check, X } from 'lucide-react';
import { ConfigProvider, Form, Input, Button, Alert } from 'antd';

const SEED_EMAILS = [
  { email: 'admin@motimahal.com', role: 'Staff Admin', password: 'admin1234' },
  { email: 'kitchen@motimahal.com', role: 'Kitchen Crew', password: 'kitchen1234' },
  { email: 'guest@demo.com', role: 'Guest Demo', password: 'guest1234' },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'seed' | 'reset' | 'success'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<(typeof SEED_EMAILS)[0] | null>(null);

  const handleEmailSubmit = (values: any) => {
    const inputEmail = values.email;
    setEmail(inputEmail);
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const targetEmail = inputEmail.trim().toLowerCase();

      // 1. Check if seed user
      const seedMatch = SEED_EMAILS.find(s => s.email.toLowerCase() === targetEmail);
      if (seedMatch) {
        setSelectedSeed(seedMatch);
        setStep('seed');
        return;
      }

      // 2. Check if registered guest in localStorage
      try {
        const raw = localStorage.getItem('motimahal_registered_guests');
        const registry = raw ? JSON.parse(raw) : [];
        const userIndex = registry.findIndex((u: any) => u.email.toLowerCase() === targetEmail);

        if (userIndex !== -1) {
          setStep('reset');
        } else {
          setError('No account found with this email. Please register a new account.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }, 600);
  };

  const handlePasswordResetSubmit = (values: any) => {
    const { newPassword, confirmPassword } = values;
    setError('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        const targetEmail = email.trim().toLowerCase();
        const raw = localStorage.getItem('motimahal_registered_guests');
        const registry = raw ? JSON.parse(raw) : [];
        const userIndex = registry.findIndex((u: any) => u.email.toLowerCase() === targetEmail);

        if (userIndex !== -1) {
          registry[userIndex].password = newPassword;
          localStorage.setItem('motimahal_registered_guests', JSON.stringify(registry));
          setStep('success');
        } else {
          setError('Account not found in registry. Please try again.');
        }
      } catch (err) {
        setError('Could not update password. Please try again.');
      }
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#243D1E', // Moss green primary
          colorBgContainer: 'var(--card-bg)',
          colorBorder: 'var(--border-color)',
          colorText: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          borderRadius: 12,
          controlHeight: 44, // Tight standard height for all form inputs & buttons
          fontSize: 13, // Smaller, cleaner font size
        },
        components: {
          Input: {
            colorBgContainer: 'var(--muted-light)', // Match brand warm sand input bg
            colorBorder: 'var(--border-color)',
            activeBorderColor: 'var(--primary-accent)', // Terracotta highlight on focus
            hoverBorderColor: 'var(--primary)', // Moss green on hover
            activeShadow: '0 0 0 1px var(--primary-accent)',
          },
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 relative">
        <Link
          href="/"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-card hover:bg-muted-light border border-border/40 text-muted hover:text-foreground transition-all duration-200 shadow-sm cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </Link>
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
          
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Motimahal Lodge"
                className="h-10 w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          {/* Step 1: Input Email */}
          {step === 'email' && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <h1 className="text-base font-bold text-foreground tracking-tight">Recover Password</h1>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Enter your email address and we&apos;ll help you recover or reset your account credentials.
                </p>
              </div>

              <Form
                layout="vertical"
                onFinish={handleEmailSubmit}
                className="w-full"
              >
                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email address!' },
                    { type: 'email', message: 'Please enter a valid email address!' },
                  ]}
                >
                  <Input
                    prefix={<Mail className="h-4 w-4 text-muted/50 mr-1.5 shrink-0" />}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Form.Item>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-light font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center border-none shadow-sm cursor-pointer"
                  >
                    Verify account email
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs text-primary font-bold hover:!underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Seed Account info */}
          {step === 'seed' && selectedSeed && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 mb-2">
                  <KeyRound className="h-5 w-5" />
                </span>
                <h1 className="text-base font-bold text-foreground tracking-tight">System Seed Account</h1>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  The email <strong className="text-foreground">{selectedSeed.email}</strong> is a predefined <strong>{selectedSeed.role}</strong> account.
                </p>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Seed account passwords cannot be changed. Please use the default credential details below to sign in.
                </p>
              </div>

              <div className="bg-muted-light border border-border rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">Default Password</span>
                  <span className="font-mono font-bold text-foreground">{selectedSeed.password}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedSeed.password)}
                  className="w-full flex items-center justify-center gap-2 bg-background hover:bg-muted border border-border text-foreground font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-muted" />
                      Copy password
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/login"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-light font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 border-none shadow-sm cursor-pointer text-center"
                >
                  Sign in now
                </Link>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setEmail(''); }}
                  className="w-full bg-transparent hover:bg-muted-light border border-transparent text-muted hover:text-foreground font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  Try another email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password for Registered Guest */}
          {step === 'reset' && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <h1 className="text-base font-bold text-foreground tracking-tight">Reset Password</h1>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Email verified. Please set a new password for <strong className="text-foreground">{email}</strong>.
                </p>
              </div>

              <Form
                layout="vertical"
                onFinish={handlePasswordResetSubmit}
                className="w-full"
              >
                {/* New Password */}
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[{ required: true, message: 'Please input your new password!' }]}
                  className="mb-3"
                >
                  <Input.Password
                    prefix={<Lock className="h-4 w-4 text-muted/50 mr-1.5 shrink-0" />}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Please confirm your new password!' }]}
                  className="mb-3"
                >
                  <Input.Password
                    prefix={<Lock className="h-4 w-4 text-muted/50 mr-1.5 shrink-0" />}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                  />
                </Form.Item>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-light font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center border-none shadow-sm cursor-pointer"
                  >
                    Update password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center animate-fade-in">
              <div className="flex flex-col items-center">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-500/10 text-green-500 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h1 className="text-base font-bold text-foreground tracking-tight">Password Updated</h1>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Your password has been successfully updated in our system database.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-light font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center border-none shadow-sm cursor-pointer text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </ConfigProvider>
  );
}
