'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Bell, LogOut, Calendar, BedDouble, Coffee, BarChart3, UtensilsCrossed, Check, User, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { useApp } from '@/context/AppContext';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const ROLE_META = {
  admin:   { emoji: '💼', label: 'Lodge Admin',  color: 'text-primary bg-primary-light border-primary/20' },
  kitchen: { emoji: '🍳', label: 'Family Kitchen', color: 'text-primary-accent bg-primary-accent/10 border-primary-accent/20' },
  guest:   { emoji: '🔑', label: 'Guest Portal', color: 'text-primary bg-primary-light border-primary/20' },
} as const;

function getNavItems(role: string, guestAuthed: boolean, queue: number) {
  if (role === 'admin') return [
    { key: 'bookings', label: 'Reservations',    icon: Calendar },
    { key: 'rooms',    label: 'Maintenance Log',  icon: BedDouble },
    { key: 'orders',   label: 'Dining Orders',    icon: Coffee },
    { key: 'reports',  label: 'Lodge Earnings',   icon: BarChart3 },
  ];
  if (role === 'kitchen') return [
    { key: 'queue',     label: 'Active Cooking',  icon: UtensilsCrossed, badge: queue || undefined },
    { key: 'completed', label: 'Served Meals',    icon: Check },
  ];
  if (role === 'guest' && guestAuthed) return [
    { key: 'stay',      label: 'My Cottage Stay',  icon: User },
    { key: 'orderFood', label: 'Order Food',       icon: Coffee },
    { key: 'requests',  label: 'Housekeeping',     icon: Sparkles },
    { key: 'orders',    label: 'Past Orders',      icon: ShoppingBag },
  ];
  return [];
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { adminTab, kitchenTab, guestTab } = useDashboard();
  const { currentBooking, currentRoomNumber, logoutGuest, orders } = useApp();
  const router = useRouter();

  if (!user) return null;

  const role = user.role;
  const meta = ROLE_META[role];
  const queue = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const guestOk = role === 'guest' && !!currentBooking;
  const navItems = getNavItems(role, guestOk, queue);

  const activeTab =
    role === 'admin' ? adminTab :
    role === 'kitchen' ? kitchenTab :
    guestTab;

  const getPageTitle = () => {
    const activeItem = navItems.find(item => item.key === activeTab);
    return activeItem ? activeItem.label : 'Motimahal Lodge';
  };

  const handleLogout = () => {
    if (role === 'guest') logoutGuest();
    logout();
    router.push('/login');
  };

  // Ant Design Dropdown items
  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="flex flex-col gap-1.5 p-2 min-w-[200px]">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">{user.name}</span>
            <span className="text-micro text-muted font-medium font-mono">{user.email}</span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-micro font-bold border ${meta.color}`}>
              {meta.emoji} {meta.label}
            </span>
          </div>
        </div>
      ),
      type: 'group',
    },
    {
      type: 'divider',
    },
    {
      key: 'website',
      label: (
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold py-1.5 text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Go to Website</span>
        </Link>
      ),
    },
    {
      key: 'logout',
      label: (
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-xs font-semibold py-1.5 text-primary-accent w-full text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log Out</span>
        </button>
      ),
    },
  ];

  return (
    <header className="h-16 border-b border-border/80 bg-card/95 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Hamburger button (mobile menu drawer) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-light cursor-pointer"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Current Section Title */}
        <div>
          <h1 className="text-xs md:text-sm font-bold text-foreground font-serif uppercase tracking-wider">
            {getPageTitle()}
          </h1>
          <p className="hidden md:block text-micro text-muted font-medium mt-0.5">
            Motimahal Lodge Sauraha, Chitwan • Nepal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Guest Cottage verification status */}
        {role === 'guest' && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-bold border ${
            guestOk ? 'bg-primary-light text-primary border-primary/20' : 'bg-primary-accent/10 text-primary-accent border-primary-accent/20'
          }`}>
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span>{guestOk ? `Cottage ${currentRoomNumber} Active` : 'Awaiting Guest Stay Code'}</span>
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className="p-2 rounded-full border border-border text-muted hover:text-foreground hover:bg-muted-light transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          {queue > 0 && role === 'kitchen' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-accent text-white text-nano font-bold border-2 border-card shadow-sm">
              {queue}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer p-0.5 hover:bg-muted-light rounded-full transition-all border border-border/80 shadow-xs">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-light text-xs font-bold uppercase shadow-inner">
              {user.name.charAt(0)}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
