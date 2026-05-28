'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Compass, Coffee, LayoutDashboard, UtensilsCrossed, LogOut, CheckCircle, UserCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname() || '';
  const { currentBooking, currentRoomNumber, logoutGuest, isLoaded } = useApp();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-primary text-primary-light'
        : 'text-muted hover:text-foreground hover:bg-muted-light'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-light">
            <Compass className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight tracking-tight text-foreground">Motimahal Lodge</span>
            <span className="text-[10px] tracking-wider uppercase text-primary font-medium leading-none">Chitwan, Nepal</span>
          </div>
        </Link>

        {/* Guest Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link href="/" className={navClass('/')}>
            Home
          </Link>
          <Link href="/portal" className={navClass('/portal')}>
            Guest Portal
          </Link>
          {isLoaded && currentBooking && (
            <Link href="/portal/order" className={navClass('/portal/order')}>
              <Coffee className="h-4 w-4" /> Order Food
            </Link>
          )}
        </nav>

        {/* Quick Actions (Admin, Kitchen & Guest Session) */}
        <div className="flex items-center gap-2">
          {/* Staff Switchers */}
          <div className="flex items-center gap-1 bg-muted-light p-1 rounded-full border border-border">
            <Link 
              href="/admin" 
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isActive('/admin') 
                  ? 'bg-primary text-primary-light shadow-sm' 
                  : 'text-muted hover:text-foreground'
              }`}
              title="Admin Panel"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <Link 
              href="/kitchen" 
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isActive('/kitchen') 
                  ? 'bg-primary text-primary-light shadow-sm' 
                  : 'text-muted hover:text-foreground'
              }`}
              title="Kitchen Display System"
            >
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kitchen</span>
            </Link>
          </div>

          {/* Active Guest Portal Info */}
          {isLoaded && currentBooking ? (
            <div className="flex items-center gap-2 border-l border-border pl-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-medium text-foreground">Room {currentRoomNumber}</span>
                <span className="text-[10px] text-muted">{currentBooking.guestName.split(' ')[0]}</span>
              </div>
              <button
                onClick={logoutGuest}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Logout from Guest Portal"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex border-l border-border pl-2">
              <Link 
                href="/portal" 
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-light text-primary border border-primary-accent text-xs font-medium hover:bg-primary hover:text-primary-light transition-all"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Guest Portal</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-border bg-background py-2">
        <Link href="/" className={`text-xs font-medium ${isActive('/') ? 'text-primary' : 'text-muted'}`}>
          Home
        </Link>
        <Link href="/portal" className={`text-xs font-medium ${isActive('/portal') ? 'text-primary' : 'text-muted'}`}>
          Guest Portal
        </Link>
        {isLoaded && currentBooking && (
          <Link href="/portal/order" className={`text-xs font-medium flex items-center gap-0.5 ${isActive('/portal/order') ? 'text-primary' : 'text-muted'}`}>
            <Coffee className="h-3 w-3" /> Order
          </Link>
        )}
      </div>
    </header>
  );
}
