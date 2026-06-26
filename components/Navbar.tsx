'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard, LogOut, User, Menu, X, ChevronDown,
} from 'lucide-react';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About Us' },
  { href: '/rooms',   label: 'Rooms' },
  { href: '/food',    label: 'Food Menu' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const pathname          = usePathname() ?? '';
  const router            = useRouter();
  const { user, logout }  = useAuth();
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [profileOpen, setProfileOpen]         = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
      isActive(href)
        ? 'bg-primary text-primary-light shadow-sm'
        : 'text-muted hover:text-foreground hover:bg-primary-light/50'
    }`;

  const handleLogoutConfirm = () => {
    logout();
    router.push('/');
    setShowLogoutModal(false);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  /* ── Ant Design Dropdown menu items ── */
  const profileMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      type: 'group',
      label: (
        <div className="flex flex-col gap-0.5 px-1 py-1 min-w-[180px]">
          <span className="text-xs font-bold text-foreground truncate">{user?.name}</span>
          <span className="text-[10px] text-muted font-medium font-mono truncate">{user?.email}</span>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      label: (
        <Link
          href="/dashboard"
          onClick={() => setProfileOpen(false)}
          className="flex items-center gap-2.5 text-xs font-semibold text-foreground py-1 cursor-pointer"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-muted shrink-0" />
          Go to Dashboard
        </Link>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <button
          onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
          className="flex items-center gap-2.5 text-xs font-semibold text-primary-accent py-1 w-full text-left cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          Sign out
        </button>
      ),
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center shrink-0 cursor-pointer">
            {/* Using plain <img> for reliable static asset rendering */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Motimahal Lodge"
              className="h-10 w-auto object-contain max-w-[130px] sm:max-w-[150px]"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">

            {user ? (
              /* Authenticated → Ant Design profile dropdown */
              <Dropdown
                menu={{ items: profileMenuItems }}
                trigger={['click']}
                placement="bottomRight"
                open={profileOpen}
                onOpenChange={setProfileOpen}
                arrow={{ pointAtCenter: true }}
              >
                <button
                  id="navbar-profile-btn"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border/80 bg-muted-light/50 hover:bg-muted-light hover:border-border transition-all duration-200 shadow-xs cursor-pointer"
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                >
                  {/* Avatar initial */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-light text-xs font-bold uppercase select-none">
                    {user.name.charAt(0)}
                  </span>
                  {/* First name on sm+ */}
                  <span className="hidden sm:block text-xs font-semibold text-foreground max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </Dropdown>
            ) : (
              /* Guest → Sign in / Register */
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-foreground bg-muted-light border border-border hover:border-primary-accent hover:text-primary-accent transition-all duration-300 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 stroke-[1.5]" />
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase bg-primary-accent text-white hover:bg-primary-accent/90 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-muted-light transition-colors cursor-pointer"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
            {/* Nav links */}
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive(href)
                    ? 'bg-primary text-primary-light'
                    : 'text-muted hover:text-foreground hover:bg-muted-light'
                }`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="my-1.5 border-t border-border/60" />
                {/* User info strip */}
                <div className="px-3 py-2 rounded-xl bg-muted-light/40 mb-1">
                  <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted font-mono truncate">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-muted-light cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-accent hover:bg-primary-accent/10 transition-colors w-full text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="my-1.5 border-t border-border/60" />
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-muted-light cursor-pointer transition-colors"
                >
                  <User className="h-4 w-4 shrink-0" />
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary-light cursor-pointer transition-colors"
                >
                  Register as Guest
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* ── Shared logout confirmation modal (Ant Design) ── */}
      <LogoutConfirmationModal
        open={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        userName={user?.name}
      />
    </>
  );
}
