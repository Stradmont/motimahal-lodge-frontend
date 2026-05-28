'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass, LogOut, Calendar, BedDouble, Coffee, BarChart3,
  UtensilsCrossed, Check, User, Sparkles, ShoppingBag,
  ChevronLeft, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard, AdminTab, KitchenTab, GuestTab } from '@/context/DashboardContext';
import { useApp } from '@/context/AppContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem { key: string; label: string; icon: React.ElementType; badge?: number }

const ROLE_META = {
  admin:   { emoji: '💼', label: 'Staff Admin',  color: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20' },
  kitchen: { emoji: '🍳', label: 'Kitchen Crew', color: 'text-amber-700  bg-amber-500/10  border-amber-500/20'  },
  guest:   { emoji: '🔑', label: 'Guest Portal', color: 'text-primary    bg-primary-light  border-primary-accent/40' },
} as const;

function getNavItems(role: string, guestAuthed: boolean, queue: number): NavItem[] {
  if (role === 'admin') return [
    { key: 'bookings', label: 'Reservations',    icon: Calendar },
    { key: 'rooms',    label: 'Room Blocks',      icon: BedDouble },
    { key: 'orders',   label: 'Food Tickets',     icon: Coffee },
    { key: 'reports',  label: 'Reports & Income', icon: BarChart3 },
  ];
  if (role === 'kitchen') return [
    { key: 'queue',     label: 'Order Queue',   icon: UtensilsCrossed, badge: queue || undefined },
    { key: 'completed', label: 'Served / Done', icon: Check },
  ];
  if (role === 'guest' && guestAuthed) return [
    { key: 'stay',      label: 'My Stay Info',      icon: User },
    { key: 'orderFood', label: 'Order Room Service', icon: Coffee },
    { key: 'requests',  label: 'Housekeeping',       icon: Sparkles },
    { key: 'orders',    label: 'Food History',       icon: ShoppingBag },
  ];
  return [];
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout }           = useAuth();
  const { adminTab, setAdminTab, kitchenTab, setKitchenTab, guestTab, setGuestTab } = useDashboard();
  const { currentBooking, logoutGuest, orders } = useApp();
  const router                     = useRouter();
  const [collapsed, setCollapsed]  = useState(false);

  if (!user) return null; // dashboard/page.tsx redirects before this mounts

  const role     = user.role;
  const meta     = ROLE_META[role];
  const queue    = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const guestOk  = role === 'guest' && !!currentBooking;
  const navItems = getNavItems(role, guestOk, queue);

  const activeTab =
    role === 'admin'   ? adminTab :
    role === 'kitchen' ? kitchenTab :
    guestTab;

  const setActiveTab = (key: string) => {
    if (role === 'admin')   setAdminTab(key as AdminTab);
    if (role === 'kitchen') setKitchenTab(key as KitchenTab);
    if (role === 'guest')   setGuestTab(key as GuestTab);
  };

  const handleLogout = () => {
    if (role === 'guest') logoutGuest();
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-card shrink-0 h-full transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-60'}`}>

        {/* Logo + collapse */}
        <div className={`flex items-center h-14 px-3 gap-2 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-light">
              <Compass className="h-4 w-4" />
            </span>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-semibold tracking-tight text-foreground">Motimahal</span>
                <span className="text-[9px] tracking-widest uppercase text-primary font-medium">Lodge Workspace</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-muted-light transition-all"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* User + role badge */}
        <div className={`px-3 py-3 border-b border-border ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <span className="text-xl" title={meta.label}>{meta.emoji}</span>
          ) : (
            <div className="flex flex-col gap-2">
              {/* User info */}
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-light text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
              </div>
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${meta.color}`}>
                {meta.emoji} {meta.label}
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
          {!collapsed && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted px-2 pb-1.5 block">
              Navigation
            </span>
          )}

          {navItems.length === 0 && !collapsed && (
            <p className="px-2 py-3 text-[10px] text-muted bg-muted-light rounded-xl border border-border text-center leading-relaxed">
              {role === 'guest'
                ? 'Verify your booking reference to unlock navigation.'
                : 'No navigation items available.'}
            </p>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center gap-2.5 rounded-xl text-xs font-medium transition-all
                  ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5 w-full'}
                  ${active ? 'bg-primary text-primary-light shadow-sm' : 'text-muted hover:text-foreground hover:bg-muted-light'}
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && !!item.badge && (
                  <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {collapsed && !!item.badge && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-amber-500 rounded-full border border-card" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-border p-3 flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
          <Link
            href="/"
            className={`flex items-center gap-2 text-muted hover:text-foreground transition-colors text-xs font-medium ${collapsed ? 'justify-center' : ''}`}
            title="Public site"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && <span>Public Site</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-xs font-semibold ${collapsed ? 'justify-center' : ''}`}
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom bar ──────────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-center justify-around px-2 py-2">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-red-500 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-[8px] font-bold">Exit</span>
        </button>

        {navItems.slice(0, 4).map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${activeTab === item.key ? 'text-primary' : 'text-muted'}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[8px] font-semibold">{item.label.split(' ')[0]}</span>
              {!!item.badge && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-amber-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 md:pb-8">
        {children}
      </main>

    </div>
  );
}
