'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Compass, LogOut, Calendar, BedDouble, Coffee, BarChart3,
  UtensilsCrossed, Check, User, ShoppingBag,
  ChevronLeft, ChevronRight, ArrowLeft, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard, AdminTab, KitchenTab, GuestTab } from '@/context/DashboardContext';
import { useApp } from '@/context/AppContext';

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavConfigItem {
  key: string;
  label: string;
  icon: React.ElementType;
  role: 'admin' | 'kitchen' | 'guest';
  badge?: (queue: number) => number | undefined;
  requiresAuth?: boolean;
}

const ALL_NAV_ITEMS: NavConfigItem[] = [
  // Admin
  { key: 'bookings', label: 'Reservations',    icon: Calendar, role: 'admin' },
  { key: 'rooms',    label: 'Maintenance Log',  icon: BedDouble, role: 'admin' },
  { key: 'orders',   label: 'Dining Orders',    icon: Coffee, role: 'admin' },
  { key: 'reports',  label: 'Lodge Earnings',   icon: BarChart3, role: 'admin' },
  // Kitchen
  { key: 'queue',     label: 'Active Cooking',  icon: UtensilsCrossed, role: 'kitchen', badge: (queue) => queue || undefined },
  { key: 'completed', label: 'Served Meals',    icon: Check, role: 'kitchen' },
  // Guest
  { key: 'stay',      label: 'My Cottage Stay',  icon: User, role: 'guest', requiresAuth: true },
  { key: 'orderFood', label: 'Order Food',       icon: Coffee, role: 'guest', requiresAuth: true },
  { key: 'requests',  label: 'Housekeeping',     icon: BedDouble, role: 'guest', requiresAuth: true },
  { key: 'orders',    label: 'Past Orders',      icon: ShoppingBag, role: 'guest', requiresAuth: true },
];

export default function DashboardSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const { adminTab, setAdminTab, kitchenTab, setKitchenTab, guestTab, setGuestTab } = useDashboard();
  const { currentBooking, logoutGuest, orders } = useApp();
  const router = useRouter();

  if (!user) return null;

  const role = user.role;
  const queue = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const guestOk = role === 'guest' && !!currentBooking;

  const navItems = ALL_NAV_ITEMS
    .filter(item => {
      if (item.role !== role) return false;
      if (item.role === 'guest' && item.requiresAuth && !guestOk) return false;
      return true;
    })
    .map(item => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      badge: item.badge ? item.badge(queue) : undefined
    }));

  const activeTab =
    role === 'admin' ? adminTab :
    role === 'kitchen' ? kitchenTab :
    guestTab;

  const setActiveTab = (key: string) => {
    if (role === 'admin') setAdminTab(key as AdminTab);
    if (role === 'kitchen') setKitchenTab(key as KitchenTab);
    if (role === 'guest') setGuestTab(key as GuestTab);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    if (role === 'guest') logoutGuest();
    logout();
    router.push('/login');
  };

  // Helper to resolve active tab styles by role
  const getActiveTabClass = (active: boolean) => {
    if (!active) return 'text-muted hover:text-foreground hover:bg-muted-light/50 border-transparent font-medium';
    if (role === 'admin') return 'bg-zinc-900 text-zinc-50 font-semibold border-zinc-800/80 shadow-xs';
    if (role === 'kitchen') return 'bg-primary-accent text-white font-semibold border-primary-accent/15 shadow-sm';
    return 'bg-primary-light text-primary font-semibold border-primary/10 shadow-xs';
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card shrink-0 h-full transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className={`flex items-center h-16 px-5 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-2.5 shrink-0 overflow-hidden">
            <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-border/85 p-0.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Motimahal Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-foreground font-serif">Motimahal</span>
                <span className="text-nano tracking-wider uppercase text-primary font-bold">Bharatpur, Chitwan</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-muted-light/60 transition-all cursor-pointer"
              title="Collapse menu"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-border/40">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-muted-light/60 transition-all cursor-pointer"
              title="Expand menu"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5">
          {navItems.length === 0 && !collapsed && (
            <div className="px-3 py-4 text-micro text-muted bg-muted-light rounded-2xl border border-border text-center leading-relaxed font-semibold">
              {role === 'guest'
                ? 'Please verify your booking reference to open stay options.'
                : 'No options available.'}
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 rounded-xl text-xs border transition-all duration-200 cursor-pointer
                  ${collapsed ? 'justify-center w-11 h-11 mx-auto' : 'px-4 py-2.5 w-full'}
                  ${getActiveTabClass(active)}`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                
                {/* Notification Badge */}
                {!collapsed && !!item.badge && (
                  <span className="ml-auto bg-primary-accent text-white text-nano font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {collapsed && !!item.badge && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary-accent rounded-full border border-card" />
                )}
              </button>
            );
          })}
        </nav>

      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          
          {/* Drawer container */}
          <aside className="relative flex flex-col w-4/5 max-w-xs bg-card border-r border-border h-full p-5 gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-border/80 p-0.5 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Motimahal Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold tracking-tight text-foreground font-serif">Motimahal</span>
                  <span className="text-nano tracking-wider uppercase text-primary font-bold">Bharatpur, Chitwan</span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-muted-light cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav items */}
            <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs border transition-all duration-200 cursor-pointer ${
                      getActiveTabClass(active)
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                    {!!item.badge && (
                      <span className="ml-auto bg-primary-accent text-white text-nano font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-border pt-4 flex flex-col gap-1.5">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-muted hover:text-foreground hover:bg-muted-light/50 transition-all border border-transparent"
                onClick={() => setMobileOpen(false)}
              >
                <ArrowLeft className="h-4.5 w-4.5 shrink-0" />
                <span>Go to Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-primary-accent/80 hover:text-primary-accent hover:bg-primary-accent/5 transition-all border border-transparent cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
