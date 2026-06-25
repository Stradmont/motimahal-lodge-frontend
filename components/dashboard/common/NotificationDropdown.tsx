'use client';

import React from 'react';
import { Calendar, Coffee, Info } from 'lucide-react';
import { Booking, Order } from '@/types';

const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'booking' | 'order' | 'system';
}

interface NotificationDropdownProps {
  role: string;
  bookings: Booking[];
  orders: Order[];
  currentBooking: Booking | null;
  currentRoomNumber: string | null;
  unreadCount: number;
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

export default function NotificationDropdown({
  role,
  bookings,
  orders,
  currentBooking,
  currentRoomNumber,
  unreadCount
}: NotificationDropdownProps) {
  const notifications = React.useMemo(() => {
    return getNotifications(role, bookings, orders, currentBooking, currentRoomNumber);
  }, [role, bookings, orders, currentBooking, currentRoomNumber]);

  return (
    <div className="w-80 md:w-96 bg-card border border-border/60 rounded-2xl shadow-xl overflow-hidden flex flex-col mt-1">
      {/* Dropdown Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted-light/20">
        <span className="text-xs font-bold text-foreground">Notifications</span>
        {unreadCount > 0 && (
          <span className="text-[10px] font-semibold bg-primary text-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto slim-scrollbar divide-y divide-border/40">
        {notifications.map(item => (
          <div
            key={item.id}
            className={cn(
              'p-3.5 flex gap-3 transition-colors hover:bg-muted-light/30',
              item.unread && 'bg-muted-light/10'
            )}
          >
            {/* Type Icon Indicator */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center border',
                item.type === 'booking' && 'bg-primary-light border-primary/20 text-primary',
                item.type === 'order' && 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/20 text-amber-600',
                item.type === 'system' && 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-muted'
              )}>
                {item.type === 'booking' && <Calendar className="h-3.5 w-3.5" />}
                {item.type === 'order' && <Coffee className="h-3.5 w-3.5" />}
                {item.type === 'system' && <Info className="h-3.5 w-3.5" />}
              </div>
              {item.unread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-accent border border-card rounded-full" />
              )}
            </div>

            {/* Notification Text */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-xs text-foreground truncate leading-snug',
                item.unread ? 'font-bold' : 'font-semibold'
              )}>
                {item.title}
              </p>
              <p className="text-[11px] text-muted leading-relaxed mt-0.5 whitespace-normal">
                {item.description}
              </p>
              <span className="text-[9px] text-muted/50 font-bold block mt-1 font-mono uppercase">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/50 bg-muted-light/20 text-center">
        <button className="text-[10px] font-bold text-primary hover:text-primary-accent transition-colors uppercase tracking-wider cursor-pointer font-semibold">
          Mark all as read
        </button>
      </div>
    </div>
  );
}
