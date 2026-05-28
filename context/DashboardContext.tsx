'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AdminTab   = 'bookings' | 'rooms' | 'orders' | 'reports';
export type KitchenTab = 'queue' | 'completed';
export type GuestTab   = 'stay' | 'orderFood' | 'requests' | 'orders';

interface DashboardContextValue {
  adminTab:      AdminTab;
  setAdminTab:   (t: AdminTab) => void;

  kitchenTab:    KitchenTab;
  setKitchenTab: (t: KitchenTab) => void;

  guestTab:      GuestTab;
  setGuestTab:   (t: GuestTab) => void;
}

// ─── Context / hook ───────────────────────────────────────────────────────────
const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const [adminTab,   setAdminTab]   = useState<AdminTab>('bookings');
  const [kitchenTab, setKitchenTab] = useState<KitchenTab>('queue');
  const [guestTab,   setGuestTab]   = useState<GuestTab>('stay');

  // Honour ?tab= deep-link on first load
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab) return;
    if (['bookings', 'rooms', 'orders', 'reports'].includes(tab)) setAdminTab(tab as AdminTab);
    if (['queue', 'completed'].includes(tab))                       setKitchenTab(tab as KitchenTab);
    if (['stay', 'orderFood', 'requests', 'orders'].includes(tab)) setGuestTab(tab as GuestTab);
  }, [searchParams]);

  return (
    <DashboardContext.Provider
      value={{ adminTab, setAdminTab, kitchenTab, setKitchenTab, guestTab, setGuestTab }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
