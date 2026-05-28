'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoomType, Booking, Order, MaintenanceBlock, BookingStatus, PaymentStatus } from '../../types';
import { 
  LayoutDashboard, Calendar, BedDouble, Coffee, BarChart3, Plus, 
  Search, Filter, Check, X, ShieldAlert, Sparkles, Image, Eye, Trash2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    roomTypes, bookings, orders, maintenanceBlocks, checkAvailability,
    createBooking, updateBookingStatus, updatePaymentStatus, addMaintenanceBlock, 
    deleteMaintenanceBlock, addRoomType, updateRoomType, isLoaded 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'orders' | 'reports'>('bookings');
  
  // Search and Filter States
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  
  // Lightbox screenshot state
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  // Walk-In Booking modal/form states
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinRoomType, setWalkinRoomType] = useState('deluxe');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinCheckIn, setWalkinCheckIn] = useState('');
  const [walkinCheckOut, setWalkinCheckOut] = useState('');
  const [walkinGuests, setWalkinGuests] = useState(2);
  const [walkinNotes, setWalkinNotes] = useState('');

  // Maintenance block form states
  const [blockRoomType, setBlockRoomType] = useState('deluxe');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');

  // Create Walk-in Reservation
  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check availability
    const available = checkAvailability(walkinRoomType, walkinCheckIn, walkinCheckOut);
    if (!available) {
      alert('Selected room type is fully booked or blocked for these dates!');
      return;
    }

    createBooking({
      guestName: walkinName,
      guestPhone: walkinPhone,
      guestEmail: walkinEmail,
      roomTypeId: walkinRoomType,
      checkIn: walkinCheckIn,
      checkOut: walkinCheckOut,
      numGuests: walkinGuests,
      notes: `${walkinNotes ? walkinNotes + ' | ' : ''}WALK-IN BOOKING`
    });

    // Reset states
    setShowWalkinModal(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinCheckIn('');
    setWalkinCheckOut('');
    setWalkinNotes('');
  };

  // Add Manual Block
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd || !blockReason) return;
    
    addMaintenanceBlock({
      id: `m_${Date.now()}`,
      roomTypeId: blockRoomType,
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockReason,
      propertyId: 'motimahal-chitwan'
    });

    setBlockStart('');
    setBlockEnd('');
    setBlockReason('');
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) || 
                          b.referenceNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.guestPhone.includes(bookingSearch);
    const matchesStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Report calculations
  const getRevenueStats = () => {
    // Rooms revenue from paid bookings (VAT and Service charges calculated)
    const roomRev = bookings.reduce((sum, b) => {
      if (b.paymentStatus !== 'Paid') return sum;
      const rt = roomTypes.find(r => r.id === b.roomTypeId);
      if (!rt) return sum;
      
      const d1 = new Date(b.checkIn);
      const d2 = new Date(b.checkOut);
      const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const subtotal = rt.price * diffDays;
      const vat = subtotal * 0.13;
      const service = subtotal * 0.10;
      return sum + subtotal + vat + service;
    }, 0);

    // Food revenue
    const foodRev = orders.reduce((sum, o) => {
      if (o.status === 'Cancelled') return sum;
      return sum + o.totalAmount;
    }, 0);

    return {
      rooms: Math.round(roomRev),
      food: Math.round(foodRev),
      total: Math.round(roomRev + foodRev)
    };
  };

  const revenue = getRevenueStats();

  const getOccupancyRate = () => {
    const totalUnits = roomTypes.reduce((s, r) => s + r.totalUnits, 0);
    const activeCheckedIn = bookings.filter(b => b.status === 'CheckedIn').length;
    if (totalUnits === 0) return 0;
    return Math.round((activeCheckedIn / totalUnits) * 100);
  };

  const occupancyRate = getOccupancyRate();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6">
      
      {/* Dashboard Top Console Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary border border-primary-accent/40">
            <LayoutDashboard className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Staff Admin Dashboard</h1>
            <p className="text-xs text-muted mt-0.5">Control front desk, modify inventory blocks, review billing and restaurant tickets.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-muted-light p-1 rounded-full border border-border w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'bookings' ? 'bg-primary text-primary-light shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Bookings
          </button>
          <button 
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'rooms' ? 'bg-primary text-primary-light shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <BedDouble className="h-3.5 w-3.5" /> Room Blocks
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'orders' ? 'bg-primary text-primary-light shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Coffee className="h-3.5 w-3.5" /> Food Orders
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'reports' ? 'bg-primary text-primary-light shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Reports
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 w-full">
        {isLoaded && (
          <>
            
            {/* ==================== TAB 1: BOOKINGS ==================== */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-6">
                
                {/* Search Bar & Action */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="flex flex-1 gap-2 items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted/60" />
                      <input 
                        type="text"
                        placeholder="Search Guest Name, phone or Ref (MM-2026-xxxx)..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="bg-card border border-border focus:border-primary focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs w-full text-foreground"
                      />
                    </div>
                    
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="bg-card border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-3 text-xs text-foreground cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="CheckedIn">Checked In</option>
                      <option value="CheckedOut">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => setShowWalkinModal(true)}
                    className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" /> Create Walk-In
                  </button>
                </div>

                {/* Bookings Table */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted-light text-muted border-b border-border font-semibold">
                          <th className="p-4">Reference</th>
                          <th className="p-4">Guest</th>
                          <th className="p-4">Stay Dates</th>
                          <th className="p-4">Room Type</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted italic">
                              No bookings found matching query.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => {
                            const rt = roomTypes.find(rt => rt.id === b.roomTypeId);
                            
                            return (
                              <tr key={b.id} className="hover:bg-muted-light/35 transition-colors">
                                <td className="p-4 font-mono font-bold text-primary">{b.referenceNumber}</td>
                                <td className="p-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-foreground">{b.guestName}</span>
                                    <span className="text-[10px] text-muted font-mono">{b.guestPhone} • {b.guestEmail}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col">
                                    <span>{b.checkIn} to {b.checkOut}</span>
                                    <span className="text-[10px] text-muted">
                                      {Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24))} Night(s)
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 font-medium text-foreground">{rt?.name || b.roomTypeId}</td>
                                <td className="p-4">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                                    b.status === 'CheckedIn'
                                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                                      : b.status === 'Confirmed'
                                        ? 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20'
                                        : b.status === 'Pending'
                                          ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                                          : 'bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${
                                      b.paymentStatus === 'Paid'
                                        ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20'
                                    }`}>
                                      {b.paymentStatus}
                                    </span>

                                    {/* Lightbox Trigger if has receipt screenshot */}
                                    {b.paymentDetails.screenshotUrl && (
                                      <button 
                                        onClick={() => setViewScreenshot(b.paymentDetails.screenshotUrl || null)}
                                        className="p-1 rounded bg-muted-light border border-border hover:bg-primary-light hover:text-primary transition-all text-muted"
                                        title="View payment receipt screenshot"
                                      >
                                        <Image className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {/* Confirm manual payment */}
                                    {b.paymentStatus !== 'Paid' && (
                                      <button
                                        onClick={() => updatePaymentStatus(b.id, 'Paid', { method: 'Bank Transfer' })}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                        title="Mark payment as verified"
                                      >
                                        Verify Pay
                                      </button>
                                    )}

                                    {/* Status transitions */}
                                    {b.status === 'Pending' && (
                                      <button
                                        onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                        className="bg-primary text-primary-light hover:bg-primary/90 px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                      >
                                        Confirm Book
                                      </button>
                                    )}

                                    {b.status === 'Confirmed' && (
                                      <button
                                        onClick={() => updateBookingStatus(b.id, 'CheckedIn')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                      >
                                        Check In
                                      </button>
                                    )}

                                    {b.status === 'CheckedIn' && (
                                      <button
                                        onClick={() => updateBookingStatus(b.id, 'CheckedOut')}
                                        className="bg-zinc-800 hover:bg-black text-white px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                      >
                                        Check Out
                                      </button>
                                    )}

                                    {b.status !== 'CheckedOut' && b.status !== 'Cancelled' && (
                                      <button
                                        onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                        className="border border-red-200 hover:bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB 2: ROOM BLOCKS ==================== */}
            {activeTab === 'rooms' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Block Creator form (Left span 5) */}
                <div className="lg:col-span-5">
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Block Dates Manually</h2>
                    <p className="text-xs text-muted leading-relaxed">
                      Manually restrict date ranges for room types due to owner usage or routine maintenance. Guests will be blocked from reserving these units on overlap dates.
                    </p>

                    <form onSubmit={handleAddBlock} className="flex flex-col gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Room Category</label>
                        <select 
                          value={blockRoomType}
                          onChange={(e) => setBlockRoomType(e.target.value)}
                          className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground font-medium cursor-pointer"
                        >
                          {roomTypes.map(rt => (
                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Start Date</label>
                          <input 
                            type="date"
                            value={blockStart}
                            onChange={(e) => setBlockStart(e.target.value)}
                            className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground font-medium"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">End Date</label>
                          <input 
                            type="date"
                            value={blockEnd}
                            onChange={(e) => setBlockEnd(e.target.value)}
                            className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground font-medium"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Reason for block</label>
                        <input 
                          type="text"
                          placeholder="e.g. AC Maintenance / Owner Stay"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-foreground w-full"
                          required
                        />
                      </div>

                      <button 
                        type="submit"
                        className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold py-3 rounded-xl shadow-sm transition-all"
                      >
                        Add Date Block
                      </button>
                    </form>
                  </div>
                </div>

                {/* Block Registry list (Right span 7) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Active Blocks Registry</h2>
                  
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 min-h-[300px]">
                    {maintenanceBlocks.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-center text-xs text-muted italic">
                        No manual blocks configured.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3.5 max-h-[450px] overflow-y-auto pr-1">
                        {maintenanceBlocks.map((block) => {
                          const rt = roomTypes.find(rt => rt.id === block.roomTypeId);
                          
                          return (
                            <div key={block.id} className="border border-border p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-foreground text-sm">{rt?.name || block.roomTypeId}</span>
                                <span className="text-muted block">Blocked: <strong>{block.startDate}</strong> to <strong>{block.endDate}</strong></span>
                                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Reason: {block.reason}</span>
                              </div>

                              <button
                                onClick={() => deleteMaintenanceBlock(block.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                                title="Remove Block"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB 3: FOOD ORDERS ==================== */}
            {activeTab === 'orders' && (
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted-light text-muted border-b border-border font-semibold">
                        <th className="p-4">Time Placed</th>
                        <th className="p-4">Room</th>
                        <th className="p-4">Items Summary</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Booking Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-muted">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted italic">
                            No food orders recorded yet.
                          </td>
                        </tr>
                      ) : (
                        [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                          <tr key={order.id} className="hover:bg-muted-light/35 transition-colors">
                            <td className="p-4 text-foreground font-mono">{new Date(order.createdAt).toLocaleString()}</td>
                            <td className="p-4 text-foreground font-bold">Room {order.roomNumber}</td>
                            <td className="p-4 text-foreground">
                              {order.items.map((item, i) => (
                                <div key={i}>
                                  x{item.quantity} {item.name}
                                </div>
                              ))}
                            </td>
                            <td className="p-4 text-primary font-bold">NPR {order.totalAmount}</td>
                            <td className="p-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                                  : order.status === 'Preparing'
                                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                                    : 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-medium">{order.bookingRef}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: REPORTS ==================== */}
            {activeTab === 'reports' && (
              <div className="flex flex-col gap-8">
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-2">
                    <span className="text-xs uppercase font-medium text-muted">Lodge Revenue</span>
                    <h3 className="text-2xl font-bold text-primary">NPR {revenue.total.toLocaleString()}</h3>
                    <div className="text-[10px] text-muted flex flex-col gap-0.5 mt-1 border-t border-border/55 pt-2">
                      <span>Room Rentals: NPR {revenue.rooms.toLocaleString()}</span>
                      <span>Food Service: NPR {revenue.food.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-muted">Lodge Occupancy Rate</span>
                      <h3 className="text-2xl font-bold text-foreground mt-2">{occupancyRate}%</h3>
                    </div>
                    <span className="text-[10px] text-muted block mt-2 leading-relaxed">
                      Based on active checked-in rooms against total unit count.
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-muted">Reservation Volume</span>
                      <h3 className="text-2xl font-bold text-foreground mt-2">{bookings.length} Bookings</h3>
                    </div>
                    <div className="text-[10px] text-muted flex gap-2 mt-2">
                      <span>Paid: {bookings.filter(b => b.paymentStatus === 'Paid').length}</span>
                      <span>Pending: {bookings.filter(b => b.paymentStatus === 'Pending').length}</span>
                    </div>
                  </div>

                </div>

                {/* Rooms visual chart grid */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Room Type Occupancy</h3>
                    <p className="text-xs text-muted mt-2">Visual overview of booked / active units per room category.</p>
                  </div>

                  <div className="flex flex-col gap-6 mt-2">
                    {roomTypes.map((rt) => {
                      const activeChecked = bookings.filter(b => b.roomTypeId === rt.id && b.status === 'CheckedIn').length;
                      const activeConfirmed = bookings.filter(b => b.roomTypeId === rt.id && b.status === 'Confirmed').length;
                      const activeBlocked = maintenanceBlocks.filter(m => m.roomTypeId === rt.id).length;
                      
                      const occupiedUnits = activeChecked + activeConfirmed + activeBlocked;
                      const occupancyPercent = Math.min(Math.round((occupiedUnits / rt.totalUnits) * 100), 100);

                      return (
                        <div key={rt.id} className="flex flex-col gap-1.5 text-xs text-muted">
                          <div className="flex justify-between items-end font-semibold text-foreground">
                            <span>{rt.name}</span>
                            <span>{occupiedUnits} / {rt.totalUnits} Units Occupied ({occupancyPercent}%)</span>
                          </div>
                          
                          {/* Progress bar container */}
                          <div className="w-full bg-muted-light h-3.5 rounded-full overflow-hidden border border-border flex">
                            {/* Checked In */}
                            {activeChecked > 0 && (
                              <div 
                                style={{ width: `${(activeChecked / rt.totalUnits) * 100}%` }}
                                className="bg-emerald-600 h-full"
                                title={`Checked in: ${activeChecked} units`}
                              ></div>
                            )}
                            {/* Confirmed Booked */}
                            {activeConfirmed > 0 && (
                              <div 
                                style={{ width: `${(activeConfirmed / rt.totalUnits) * 100}%` }}
                                className="bg-primary h-full opacity-70"
                                title={`Confirmed: ${activeConfirmed} units`}
                              ></div>
                            )}
                            {/* Blocked */}
                            {activeBlocked > 0 && (
                              <div 
                                style={{ width: `${(activeBlocked / rt.totalUnits) * 100}%` }}
                                className="bg-amber-500 h-full"
                                title={`Blocked: ${activeBlocked} units`}
                              ></div>
                            )}
                          </div>
                          
                          {/* Legend label */}
                          <div className="flex gap-4 text-[10px] text-muted">
                            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-600 rounded"></span> Checked In ({activeChecked})</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-primary opacity-70 rounded"></span> Confirmed ({activeConfirmed})</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-amber-500 rounded"></span> Blocked/Maintenance ({activeBlocked})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </>
        )}
      </div>

      {/* LIGHTBOX MODAL: Verified Bank Receipt Image */}
      {viewScreenshot && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setViewScreenshot(null)}
        >
          <div className="relative max-w-lg w-full bg-card rounded-3xl overflow-hidden shadow-2xl p-4 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Guest Payment Receipt</span>
              <button 
                onClick={() => setViewScreenshot(null)}
                className="text-muted hover:text-foreground p-1 rounded-md hover:bg-muted-light"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-zinc-950">
              <img 
                src={viewScreenshot} 
                alt="Receipt screenshot upload" 
                className="object-contain w-full h-full"
              />
            </div>
            <p className="text-[10px] text-muted text-center mt-3">Click anywhere outside to exit receipt viewer.</p>
          </div>
        </div>
      )}

      {/* MODAL: CREATE WALK-IN BOOKING */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-primary-light px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Create Walk-In Reservation</h2>
              <button 
                onClick={() => setShowWalkinModal(false)}
                className="text-primary-light/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWalkin} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Room Type</label>
                  <select 
                    value={walkinRoomType}
                    onChange={(e) => setWalkinRoomType(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground cursor-pointer"
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>{rt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Guests</label>
                  <select 
                    value={walkinGuests}
                    onChange={(e) => setWalkinGuests(Number(e.target.value))}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Check-in Date</label>
                  <input 
                    type="date"
                    value={walkinCheckIn}
                    onChange={(e) => setWalkinCheckIn(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Check-out Date</label>
                  <input 
                    type="date"
                    value={walkinCheckOut}
                    onChange={(e) => setWalkinCheckOut(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl p-2.5 text-xs text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Guest Name</label>
                <input 
                  type="text"
                  placeholder="Full Name"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone</label>
                  <input 
                    type="text"
                    placeholder="98XXXXXXXX"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-foreground"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email</label>
                  <input 
                    type="email"
                    placeholder="email@domain.com"
                    value={walkinEmail}
                    onChange={(e) => setWalkinEmail(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Walk-in Notes / Special requests</label>
                <textarea 
                  placeholder="Notes"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  rows={2}
                  className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-foreground resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-light py-3 rounded-xl font-medium text-xs transition-all shadow-md mt-2"
              >
                Book Walk-In Reservation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
