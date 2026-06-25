'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useDashboard } from '@/context/DashboardContext';
import AdminView from '@/components/dashboard/views/AdminView';
import KitchenView from '@/components/dashboard/views/KitchenView';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { adminTab, setAdminTab, kitchenTab, setKitchenTab, guestTab, setGuestTab } = useDashboard();

  const {
    roomTypes, bookings, orders, maintenanceBlocks,
    checkAvailability, createBooking, updateBookingStatus, updatePaymentStatus,
    addMaintenanceBlock, deleteMaintenanceBlock, isLoaded,
    currentBooking, currentRoomNumber, loginGuest, logoutGuest,
    addToCart, cart, updateCartQuantity, removeFromCart, placeOrder,
    updateOrderStatus, foodItems,
  } = useApp();

  // Redirect unauthenticated visitors to login
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Loading states
  if (authLoading || !isLoaded || !user) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  if (user.role === 'admin') {
    return (
      <AdminView
        bookings={bookings}
        roomTypes={roomTypes}
        orders={orders}
        maintenanceBlocks={maintenanceBlocks}
        updateBookingStatus={updateBookingStatus}
        updatePaymentStatus={updatePaymentStatus}
        createBooking={createBooking}
        checkAvailability={checkAvailability}
        addMaintenanceBlock={addMaintenanceBlock}
        deleteMaintenanceBlock={deleteMaintenanceBlock}
        activeTab={adminTab}
        setActiveTab={setAdminTab}
      />
    );
  }

  // ── Kitchen ────────────────────────────────────────────────────────────────
  if (user.role === 'kitchen') {
    return (
      <KitchenView
        orders={orders}
        updateOrderStatus={updateOrderStatus}
        activeTab={kitchenTab}
        setActiveTab={setKitchenTab}
      />
    );
  }

}
