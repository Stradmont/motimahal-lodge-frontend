'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass, LogOut, LayoutDashboard, User, Menu, X,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/rooms',   label: 'Rooms' },
  { href: '/food',    label: 'Food Menu' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const pathname         = usePathname() ?? '';
  const router           = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
      isActive(href)
        ? 'bg-primary text-primary-light shadow-sm'
        : 'text-muted hover:text-foreground hover:bg-primary-light/50'
    }`;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-light shadow-sm">
            <Compass className="h-5 w-5 stroke-[1.5]" />
          </span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-serif font-semibold tracking-tight text-foreground">Motimahal</span>
            <span className="text-[10px] text-primary-accent uppercase tracking-wider font-bold">Lodge · Chitwan</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* User chip */}
              <div className="hidden sm:flex items-center gap-2 bg-muted-light border border-border rounded-full pl-1 pr-3 py-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-accent text-white text-[10px] font-bold uppercase">
                  {user.name.charAt(0)}
                </span>
                <span className="text-xs font-medium text-foreground max-w-[120px] truncate">{user.name}</span>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-primary text-primary-light border-primary shadow-sm'
                    : 'bg-muted-light text-foreground border-border hover:border-primary-accent hover:text-primary-accent'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-foreground bg-muted-light border border-border hover:border-primary-accent hover:text-primary-accent transition-all duration-300"
              >
                <User className="h-3.5 w-3.5 stroke-[1.5]" />
                Sign in
              </Link>
              <Link
                href="/register"
                className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase bg-primary-accent text-white hover:bg-primary-accent/90 transition-all duration-300 shadow-sm"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-muted-light transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-primary text-primary-light'
                  : 'text-muted hover:text-foreground hover:bg-muted-light'
              }`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-muted-light"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary-light"
            >
              Register as Guest
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
