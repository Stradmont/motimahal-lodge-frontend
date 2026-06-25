'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu, Bell, LogOut, Calendar, BedDouble, Coffee, BarChart3,
  UtensilsCrossed, Check, User, ShoppingBag, ArrowLeft, Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { useApp } from '@/context/AppContext';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Booking, Order } from '@/types';
import NotificationDropdown from '@/components/dashboard/common/NotificationDropdown';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal';

// Helper to concatenate classNames conditionally
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'booking' | 'order' | 'system';
}

const ROLE_META = {
  admin: { emoji: '💼', label: 'Lodge Admin', color: 'text-primary bg-primary-light border-primary/20' },
  kitchen: { emoji: '🍳', label: 'Family Kitchen', color: 'text-primary-accent bg-primary-accent/10 border-primary-accent/20' },
  guest: { emoji: '🔑', label: 'Guest Portal', color: 'text-primary bg-primary-light border-primary/20' },
} as const;

function getNavItems(role: string, guestAuthed: boolean, queue: number) {
  if (role === 'admin') return [
    { key: 'bookings', label: 'Reservations', icon: Calendar },
    { key: 'rooms', label: 'Maintenance Log', icon: BedDouble },
    { key: 'orders', label: 'Dining Orders', icon: Coffee },
    { key: 'reports', label: 'Lodge Earnings', icon: BarChart3 },
  ];
  if (role === 'kitchen') return [
    { key: 'queue', label: 'Active Cooking', icon: UtensilsCrossed, badge: queue || undefined },
    { key: 'completed', label: 'Served Meals', icon: Check },
  ];
  if (role === 'guest' && guestAuthed) return [
    { key: 'stay', label: 'My Cottage Stay', icon: User },
    { key: 'orderFood', label: 'Order Food', icon: Coffee },
    { key: 'requests', label: 'Housekeeping', icon: BedDouble },
    { key: 'orders', label: 'Past Orders', icon: ShoppingBag },
  ];
  return [];
}

// Generate dynamic, state-synchronized notifications based on current data
function getNotifications(
  role: string,
  bookings: Booking[],
  orders: Order[],
  currentBooking: Booking | null,
  currentRoomNumber: string | null
): NotificationItem[] {
  const list: NotificationItem[] = [];

  if (role === 'admin') {
    // Pending payment confirmations
    bookings.filter(b => b.status === 'Pending').slice(0, 2).forEach(b => {
      list.push({
        id: `noti-b-pnd-${b.id}`,
        title: 'Pending Reservation',
        description: `Verify payment for ${b.guestName} (${b.referenceNumber})`,
        time: 'Just now',
        unread: true,
        type: 'booking'
      });
    });
    // Active orders in placed state
    orders.filter(o => o.status === 'Placed').slice(0, 2).forEach(o => {
      list.push({
        id: `noti-o-plc-${o.id}`,
        title: 'New Dining Order',
        description: `Room ${o.roomNumber} ordered ${o.items.length} item(s) (NPR ${o.totalAmount.toLocaleString()})`,
        time: '5m ago',
        unread: true,
        type: 'order'
      });
    });
    // Fallback if list is empty
    if (list.length === 0) {
      list.push({
        id: 'noti-admin-default',
        title: 'Lodge Systems Active',
        description: 'No pending alerts. Guest operations are running smoothly.',
        time: '1h ago',
        unread: false,
        type: 'system'
      });
    }
  } else if (role === 'kitchen') {
    // Orders to cook
    orders.filter(o => o.status === 'Placed' || o.status === 'Preparing').slice(0, 4).forEach(o => {
      list.push({
        id: `noti-k-ord-${o.id}`,
        title: o.status === 'Placed' ? 'New Kitchen Order' : 'Order Preparing',
        description: `Room ${o.roomNumber} · ${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
        time: o.status === 'Placed' ? 'Just now' : '10m ago',
        unread: o.status === 'Placed',
        type: 'order'
      });
    });
    // Fallback if empty
    if (list.length === 0) {
      list.push({
        id: 'noti-kitchen-default',
        title: 'Kitchen Dashboard Clear',
        description: 'No active orders in queue.',
        time: '1h ago',
        unread: false,
        type: 'system'
      });
    }
  } else if (role === 'guest') {
    if (currentBooking) {
      list.push({
        id: 'noti-g-welcome',
        title: 'Welcome to Motimahal Lodge',
        description: `Your stay in Cottage ${currentRoomNumber || ''} is verified. Use the portal to order dining or request housekeeping.`,
        time: '10m ago',
        unread: false,
        type: 'system'
      });
      // Active orders placed by this guest
      orders.filter(o => o.bookingRef === currentBooking.referenceNumber).slice(0, 3).forEach(o => {
        list.push({
          id: `noti-g-ord-${o.id}`,
          title: `Dining Order: ${o.status}`,
          description: `Your meal order of NPR ${o.totalAmount.toLocaleString()} is currently ${o.status.toLowerCase()}`,
          time: 'Just now',
          unread: ['Placed', 'Preparing'].includes(o.status),
          type: 'order'
        });
      });
    } else {
      list.push({
        id: 'noti-g-inactive',
        title: 'Stay Awaiting Activation',
        description: 'Enter your Booking Reference and Phone Number to verify your stay and access cottage services.',
        time: 'Just now',
        unread: true,
        type: 'system'
      });
    }
  }

  return list;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { adminTab, kitchenTab, guestTab, setIsSearchOpen } = useDashboard();
  const { bookings, currentBooking, currentRoomNumber, logoutGuest, orders } = useApp();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const role = user.role;
  const meta = ROLE_META[role];
  const queue = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const guestOk = role === 'guest' && !!currentBooking;

  const handleLogoutConfirm = () => {
    if (role === 'guest') logoutGuest();
    logout();
    router.push('/login');
    setShowLogoutModal(false);
  };

  // Dynamically compute list of notification items
  const notifications = React.useMemo(() => {
    return getNotifications(role, bookings, orders, currentBooking, currentRoomNumber);
  }, [role, bookings, orders, currentBooking, currentRoomNumber]);

  const unreadCount = React.useMemo(() => {
    return notifications.filter(n => n.unread).length;
  }, [notifications]);

  // Ant Design Dropdown items (Profile)
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
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 text-xs font-semibold py-1.5 text-primary-accent w-full text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log Out</span>
        </button>
      ),
    },
  ];

  return (
    <>
    <header className="h-16 border-b border-border/80 bg-card/95 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 z-20 shadow-xs">
      <div className="flex items-center gap-3 min-w-[40px] md:min-w-[120px]">
        {/* Hamburger button (mobile menu drawer) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-light cursor-pointer"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center Search Button */}
      <div className="hidden sm:flex flex-1 justify-center max-w-md mx-auto">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-muted-light/45 hover:bg-muted-light/95 hover:border-border/85 text-xs text-muted transition-all duration-200 cursor-pointer w-full max-w-[260px] justify-between shadow-xs"
          title="Search dashboard (Ctrl+K)"
        >
          <div className="flex items-center gap-2 text-muted/70">
            <Search className="h-3.5 w-3.5" />
            <span className="font-semibold text-micro uppercase tracking-wider">Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded-lg border border-border/60 bg-card text-[9px] font-bold text-muted/60 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 justify-end">
        {/* Guest Cottage verification status */}
        {role === 'guest' && (
          <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-micro font-bold border ${guestOk ? 'bg-primary-light text-primary border-primary/20' : 'bg-primary-accent/10 text-primary-accent border-primary-accent/20'
            }`}>
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span>{guestOk ? `Cottage ${currentRoomNumber} Active` : 'Awaiting Guest Stay Code'}</span>
          </div>
        )}

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex sm:hidden p-2 rounded-full border border-border text-muted hover:text-foreground hover:bg-muted-light transition-all cursor-pointer"
          title="Search dashboard"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <Dropdown
          popupRender={() => (
            <NotificationDropdown
              role={role}
              bookings={bookings}
              orders={orders}
              currentBooking={currentBooking}
              currentRoomNumber={currentRoomNumber}
              unreadCount={unreadCount}
            />
          )}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <div className="relative cursor-pointer">
            <button
              className="p-2 rounded-full border border-border text-muted hover:text-foreground hover:bg-muted-light transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold border-2 border-card shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
        </Dropdown>

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

      {/* Logout confirmation modal */}
      <LogoutConfirmationModal
        open={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        userName={user.name}
      />
    </>
  );
}
