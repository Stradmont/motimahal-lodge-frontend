'use client';

import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { AdminTab, GuestTab, KitchenTab, useDashboard } from '@/context/DashboardContext';
import { Modal } from 'antd';
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Calendar,
  Check,
  Coffee,
  Command,
  Compass,
  Info,
  Search,
  ShoppingBag,
  User,
  UtensilsCrossed,
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Helper to concatenate classNames conditionally
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface ResultItem {
  id: string;
  type: 'tab' | 'booking' | 'room' | 'food' | 'order';
  title: string;
  subtitle: string;
  category?: string;
  tabKey: string;
}

interface ResultGroup {
  key: string;
  value: ResultItem[];
}

function ResultIcon({ type }: { type: string }) {
  const size = 16;
  if (type === 'tab') return <Compass size={size} className="text-primary-accent" />;
  if (type === 'booking') return <Calendar size={size} className="text-primary" />;
  if (type === 'food') return <Coffee size={size} className="text-amber-600" />;
  if (type === 'room') return <BedDouble size={size} className="text-zinc-650" />;
  return <UtensilsCrossed size={size} className="text-primary-accent" />;
}

function getIconBg(type: string) {
  if (type === 'tab') return 'bg-primary-accent/10 border border-primary-accent/15';
  if (type === 'booking') return 'bg-primary-light border border-primary/15';
  if (type === 'food') return 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/20';
  if (type === 'room') return 'bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800';
  return 'bg-primary-accent/10 border border-primary-accent/15';
}

function getCategoryStyle(category?: string) {
  if (!category) return '';
  const cat = category.toLowerCase();
  if (['pending', 'placed', 'dirty'].includes(cat)) {
    return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
  }
  if (['confirmed', 'paid', 'available', 'delivered', 'served', 'checkedin'].includes(cat)) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
  }
  if (['cancelled', 'maintenance', 'occupied', 'checkedout'].includes(cat)) {
    return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30';
  }
  return 'bg-zinc-50 text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800';
}

export default function CommandCenter() {
  const { user } = useAuth();
  const { isSearchOpen: isOpen, setIsSearchOpen: setIsOpen, setAdminTab, setKitchenTab, setGuestTab } = useDashboard();
  const { bookings, foodItems, rooms, orders } = useApp();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const role = user?.role || '';

  // Get search results in-memory
  const groups: ResultGroup[] = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];

    const resGroups: ResultGroup[] = [];

    // 1. Search Tabs/Navigation
    const tabResults: ResultItem[] = [];
    const allTabs = {
      admin: [
        { key: 'bookings', label: 'Reservations', desc: 'View bookings, check-in guests, verify payments', icon: Calendar },
        { key: 'rooms', label: 'Maintenance Log', desc: 'Manage room status, clean logs, maintenance blocks', icon: BedDouble },
        { key: 'orders', label: 'Dining Orders', desc: 'View room service orders and kitchen statuses', icon: Coffee },
        { key: 'reports', label: 'Lodge Earnings', desc: 'View earnings summaries and sales charts', icon: BarChart3 },
      ],
      kitchen: [
        { key: 'queue', label: 'Active Cooking Queue', desc: 'Process new and preparing dining orders', icon: UtensilsCrossed },
        { key: 'completed', label: 'Served Meals', desc: 'View archive of completed and served orders', icon: Check },
      ],
      guest: [
        { key: 'stay', label: 'My Cottage Stay', desc: 'Verify booking, view check-in details, room services', icon: User },
        { key: 'orderFood', label: 'Order Food', desc: 'Browse the menu and order food to your cottage', icon: Coffee },
        { key: 'requests', label: 'Housekeeping', desc: 'Request towels, cleaning, or general assistance', icon: Info },
        { key: 'orders', label: 'Past Orders', desc: 'Track details and statuses of placed orders', icon: ShoppingBag },
      ],
    };

    const roleTabs = allTabs[role as keyof typeof allTabs] || [];
    roleTabs.forEach(t => {
      if (t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) {
        tabResults.push({
          id: `tab-${t.key}`,
          type: 'tab',
          title: t.label,
          subtitle: t.desc,
          tabKey: t.key,
        });
      }
    });
    if (tabResults.length > 0) {
      resGroups.push({ key: 'Navigation', value: tabResults });
    }

    // 2. Search Bookings (Reservations) - Admin only
    if (role === 'admin') {
      const bookingResults: ResultItem[] = [];
      bookings.forEach(b => {
        const matchText = `${b.guestName} ${b.referenceNumber} ${b.guestEmail} ${b.guestPhone} ${b.status}`.toLowerCase();
        if (matchText.includes(q)) {
          bookingResults.push({
            id: b.id,
            type: 'booking',
            title: b.guestName,
            subtitle: `${b.referenceNumber} · ${b.guestPhone} · ${b.checkIn} to ${b.checkOut}`,
            category: b.status,
            tabKey: 'bookings',
          });
        }
      });
      if (bookingResults.length > 0) {
        resGroups.push({ key: 'Reservations', value: bookingResults.slice(0, 5) });
      }
    }

    // 3. Search Food Items (Everyone)
    const foodResults: ResultItem[] = [];
    foodItems.forEach(f => {
      const matchText = `${f.name} ${f.description} ${f.category}`.toLowerCase();
      if (matchText.includes(q)) {
        foodResults.push({
          id: f.id,
          type: 'food',
          title: f.name,
          subtitle: `${f.category} · NPR ${f.price.toLocaleString()} · ${f.isAvailable ? 'Available' : 'Out of stock'}`,
          category: f.category,
          tabKey: role === 'guest' ? 'orderFood' : (role === 'kitchen' ? 'queue' : 'orders'),
        });
      }
    });
    if (foodResults.length > 0) {
      resGroups.push({ key: 'Kitchen Menu', value: foodResults.slice(0, 5) });
    }

    // 4. Search Rooms (Admin only)
    if (role === 'admin') {
      const roomResults: ResultItem[] = [];
      rooms.forEach(r => {
        const matchText = `room ${r.roomNumber} ${r.roomTypeId} ${r.status}`.toLowerCase();
        if (matchText.includes(q)) {
          roomResults.push({
            id: r.id,
            type: 'room',
            title: `Room ${r.roomNumber}`,
            subtitle: `Type: ${r.roomTypeId.toUpperCase()} · Status: ${r.status}`,
            category: r.status,
            tabKey: 'rooms',
          });
        }
      });
      if (roomResults.length > 0) {
        resGroups.push({ key: 'Cottages & Rooms', value: roomResults.slice(0, 5) });
      }
    }

    // 5. Search Orders (Admin & Kitchen see all, Guests see all relevant)
    const orderResults: ResultItem[] = [];
    orders.forEach(o => {
      const itemNames = o.items.map(i => i.name).join(' ');
      const matchText = `order ${o.id} room ${o.roomNumber} ${o.bookingRef} ${o.status} ${itemNames}`.toLowerCase();
      if (matchText.includes(q)) {
        orderResults.push({
          id: o.id,
          type: 'order',
          title: `Order for Room ${o.roomNumber}`,
          subtitle: `${o.bookingRef} · ${o.items.length} items · NPR ${o.totalAmount.toLocaleString()}`,
          category: o.status,
          tabKey: role === 'kitchen' ? 'queue' : 'orders',
        });
      }
    });
    if (orderResults.length > 0) {
      resGroups.push({ key: 'Dining Orders', value: orderResults.slice(0, 5) });
    }

    return resGroups;
  }, [search, role, bookings, foodItems, rooms, orders]);

  const results: ResultItem[] = React.useMemo(() => {
    return groups.flatMap(g => g.value);
  }, [groups]);

  /* Keyboard shortcut to open (Cmd+K or Ctrl+K) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsOpen]);

  /* Focus input and reset state on open */
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    setSearch('');
    setSelectedIndex(0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  /* Scroll selected row into view */
  useEffect(() => {
    const el = resultsRef.current?.querySelector<HTMLElement>(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  /* Handle Selection and Tab Navigation */
  const handleSelect = useCallback(
    (item: ResultItem) => {
      if (role === 'admin') setAdminTab(item.tabKey as AdminTab);
      if (role === 'kitchen') setKitchenTab(item.tabKey as KitchenTab);
      if (role === 'guest') setGuestTab(item.tabKey as GuestTab);
      setIsOpen(false);
    },
    [role, setAdminTab, setKitchenTab, setGuestTab, setIsOpen]
  );

  /* Keyboard navigation inside results */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showEmpty = search.trim().length === 0;
  const showNoResults = search.trim().length > 0 && results.length === 0;
  const showResults = results.length > 0;

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      closable={false}
      width={620}
      centered
      style={{
        borderRadius: 14,
        overflow: 'hidden',
      }}
      styles={{
        body: { padding: 0 },
        mask: { backdropFilter: 'blur(4px)', background: 'rgba(15,15,20,0.45)' },
      }}
      className="command-center-modal"
    >
      <div className="flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 shadow-2xl">
        {/* ── Search bar ── */}
        <div className="relative group flex items-center gap-3 px-4 py-4 border-b border-border/50">
          <Search
            size={18}
            className="text-muted group-focus-within:text-primary transition-colors duration-200 shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search bookings, rooms, meals..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none border-none ring-0 shadow-none focus:outline-none"
          />
          {search.length > 0 ? (
            <button
              onClick={() => setSearch('')}
              className="shrink-0 w-5 h-5 rounded-full bg-muted-light flex items-center justify-center text-muted hover:bg-muted-light/80 transition-colors cursor-pointer"
            >
              <X size={11} />
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-1 px-1.5 py-1 rounded bg-muted-light border border-border text-[9px] font-bold text-muted/80">
              <Command size={10} />
              <span>K</span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div ref={resultsRef} className="overflow-y-auto" style={{ minHeight: 200, maxHeight: 400 }}>
          {/* Empty / hint state */}
          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-12 px-8 gap-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-muted-light border border-border flex items-center justify-center text-muted">
                <Search size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">Quick search</p>
                <p className="text-xs text-muted">Search across everything in the dashboard</p>
              </div>

              {/* Shortcut hints */}
              <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
                {role === 'admin' && [
                  { label: 'Reservations', tab: 'bookings' },
                  { label: 'Maintenance Log', tab: 'rooms' },
                  { label: 'Dining Orders', tab: 'orders' },
                  { label: 'Earnings', tab: 'reports' }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { setSearch(item.label); inputRef.current?.focus(); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted-light border border-border text-xs text-muted hover:text-foreground hover:bg-muted-light/80 transition-colors cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                {role === 'kitchen' && [
                  { label: 'Active Cooking', tab: 'queue' },
                  { label: 'Served Meals', tab: 'completed' }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { setSearch(item.label); inputRef.current?.focus(); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted-light border border-border text-xs text-muted hover:text-foreground hover:bg-muted-light/80 transition-colors cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                {role === 'guest' && [
                  { label: 'My Cottage Stay', tab: 'stay' },
                  { label: 'Order Food', tab: 'orderFood' },
                  { label: 'Housekeeping', tab: 'requests' }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { setSearch(item.label); inputRef.current?.focus(); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted-light border border-border text-xs text-muted hover:text-foreground hover:bg-muted-light/80 transition-colors cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-muted-light border border-border flex items-center justify-center text-muted/40">
                <Search size={18} />
              </div>
              <p className="text-xs font-semibold text-muted">No results found for "{search}"</p>
              <p className="text-[11px] text-muted/60">Try searching for other names, room numbers, or keywords</p>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="py-2">
              {groups.map(group => (
                <div key={group.key} className="mb-2 last:mb-0">
                  {/* Group label */}
                  <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted/60">
                      {group.key}
                    </span>
                    <span className="text-[10px] font-medium text-muted/40 tabular-nums">
                      {group.value.length}
                    </span>
                  </div>

                  {/* Group rows */}
                  {group.value.map(item => {
                    const globalIndex = results.findIndex(
                      i => i.id === item.id && i.type === item.type
                    );
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        data-idx={globalIndex}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          'flex items-center justify-between mx-2 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-75 group',
                          isSelected ? 'bg-muted-light text-foreground font-medium' : 'hover:bg-muted-light/40'
                        )}
                      >
                        {/* Left: icon + text */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-75',
                            getIconBg(item.type),
                            isSelected && 'scale-105'
                          )}>
                            <ResultIcon type={item.type} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate leading-tight">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted truncate max-w-sm leading-snug mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Right: badge + enter hint */}
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {item.category && (
                            <span className={cn(
                              'text-[9px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                              getCategoryStyle(item.category)
                            )}>
                              {item.category}
                            </span>
                          )}
                          <span className={cn(
                            'text-[10px] text-muted/65 transition-opacity duration-75 flex items-center gap-0.5',
                            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-65'
                          )}>
                            Go <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted-light/35">
          <div className="flex items-center gap-4">
            {[
              { key: '↵', label: 'select' },
              { key: '↑↓', label: 'navigate' },
              { key: 'esc', label: 'close' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-1 text-[10px] text-muted">
                <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[9px] font-semibold text-foreground shadow-sm">
                  {key}
                </kbd>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <span className="text-[9px] text-muted/50 font-bold uppercase tracking-wider">Command Center</span>
        </div>
      </div>
    </Modal>
  );
}
