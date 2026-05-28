'use client';

import React, { useState } from 'react';
import { Search, Plus, Calendar, BedDouble, Coffee, BarChart3, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { Booking, RoomType, Order, MaintenanceBlock } from '../../types';

interface AdminWorkspaceProps {
  bookings: Booking[];
  roomTypes: RoomType[];
  orders: Order[];
  maintenanceBlocks: MaintenanceBlock[];
  updateBookingStatus: (id: string, status: any) => void;
  updatePaymentStatus: (id: string, paymentStatus: any, details?: any) => void;
  createBooking: (details: any) => void;
  checkAvailability: (id: string, start: string, end: string) => boolean;
  addMaintenanceBlock: (block: any) => void;
  deleteMaintenanceBlock: (id: string) => void;
  activeTab: 'bookings' | 'rooms' | 'orders' | 'reports';
  setActiveTab: (tab: 'bookings' | 'rooms' | 'orders' | 'reports') => void;
}

export default function AdminWorkspace({
  bookings,
  roomTypes,
  orders,
  maintenanceBlocks,
  updateBookingStatus,
  updatePaymentStatus,
  createBooking,
  checkAvailability,
  addMaintenanceBlock,
  deleteMaintenanceBlock,
  activeTab,
  setActiveTab
}: AdminWorkspaceProps) {

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Lightbox
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  // Walk-in modal
  const [showWalkin, setShowWalkin] = useState(false);
  const [walkinRoom, setWalkinRoom] = useState('deluxe');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinIn, setWalkinIn] = useState('');
  const [walkinOut, setWalkinOut] = useState('');
  const [walkinGuests, setWalkinGuests] = useState(2);
  const [walkinNotes, setWalkinNotes] = useState('');

  // Maintenance blocks
  const [blockType, setBlockType] = useState('deluxe');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAvail = checkAvailability(walkinRoom, walkinIn, walkinOut);
    if (!isAvail) {
      alert('Selected Room Type is unavailable or fully blocked for these dates!');
      return;
    }

    createBooking({
      guestName: walkinName,
      guestPhone: walkinPhone,
      guestEmail: walkinEmail,
      roomTypeId: walkinRoom,
      checkIn: walkinIn,
      checkOut: walkinOut,
      numGuests: walkinGuests,
      notes: `${walkinNotes ? walkinNotes + ' | ' : ''}WALK-IN BOOKING`
    });

    setShowWalkin(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinIn('');
    setWalkinOut('');
    setWalkinNotes('');
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd || !blockReason) return;

    addMaintenanceBlock({
      id: `m_${Date.now()}`,
      roomTypeId: blockType,
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockReason,
      propertyId: 'motimahal-chitwan'
    });

    setBlockStart('');
    setBlockEnd('');
    setBlockReason('');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.guestPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Reports math
  const getRevenueStats = () => {
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Mobile view sub-tabs layout */}
      <div className="md:hidden flex items-center gap-1 bg-muted-light p-1 rounded-xl border border-border overflow-x-auto">
        {(['bookings', 'rooms', 'orders', 'reports'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeTab === tab ? 'bg-primary text-primary-light shadow-sm' : 'text-muted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. BOOKINGS LIST TAB */}
      {activeTab === 'bookings' && (
        <div className="flex flex-col gap-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted/60" />
                <input 
                  type="text"
                  placeholder="Search Guest Name, phone or Reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-card border border-border focus:border-primary focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs w-full text-foreground"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-card border border-border focus:border-primary focus:outline-none rounded-xl px-2 py-2 text-xs text-foreground cursor-pointer"
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
              onClick={() => setShowWalkin(true)}
              className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" /> Create Walk-In
            </button>
          </div>

          {/* Bookings table */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted-light text-muted border-b border-border font-semibold">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Guest Info</th>
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
                      <td colSpan={7} className="p-8 text-center text-muted italic">No bookings found in database.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const rt = roomTypes.find(rt => rt.id === b.roomTypeId);
                      return (
                        <tr key={b.id} className="hover:bg-muted-light/30 transition-colors">
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
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                              b.status === 'CheckedIn'
                                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                                : b.status === 'Confirmed'
                                  ? 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20'
                                  : b.status === 'Pending'
                                    ? 'bg-amber-500/10 text-amber-800 border-amber-500/20'
                                    : 'bg-red-500/10 text-red-800 border-red-500/20'
                            }`}>{b.status}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                                b.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : 'bg-red-500/10 text-red-800 border-red-500/20'
                              }`}>{b.paymentStatus}</span>
                              {b.paymentDetails.screenshotUrl && (
                                <button 
                                  onClick={() => setViewScreenshot(b.paymentDetails.screenshotUrl || null)}
                                  className="p-1 rounded bg-muted-light border border-border text-muted hover:text-primary transition-all"
                                >
                                  <ImageIcon className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {b.paymentStatus !== 'Paid' && (
                                <button
                                  onClick={() => updatePaymentStatus(b.id, 'Paid', { method: 'Bank Transfer' })}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all font-sans"
                                >
                                  Verify Pay
                                </button>
                              )}

                              {b.status === 'Pending' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                  className="bg-primary text-primary-light hover:bg-primary/90 px-2 py-1 rounded text-[10px] font-semibold transition-all font-sans"
                                >
                                  Confirm Book
                                </button>
                              )}

                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'CheckedIn')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all font-sans"
                                >
                                  Check In
                                </button>
                              )}

                              {b.status === 'CheckedIn' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'CheckedOut')}
                                  className="bg-zinc-800 hover:bg-black text-white px-2 py-1 rounded text-[10px] font-semibold transition-all font-sans"
                                >
                                  Check Out
                                </button>
                              )}

                              {b.status !== 'CheckedOut' && b.status !== 'Cancelled' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                  className="border border-red-200 hover:bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-semibold transition-all font-sans"
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

      {/* 2. ROOM BLOCKS TAB */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Block Dates Manually</h3>
              <form onSubmit={handleAddBlock} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Room Type</label>
                  <select 
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value)}
                    className="bg-muted-light border border-border focus:border-primary rounded-xl p-2.5 text-xs text-foreground cursor-pointer font-medium"
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>{rt.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Start Date</label>
                    <input type="date" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-medium" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">End Date</label>
                    <input type="date" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-medium" required />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Reason</label>
                  <input type="text" placeholder="AC Repair / Maintenance" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground w-full font-medium" required />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold py-3 rounded-xl shadow-sm transition-all font-sans">Add Block</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Active Block Registry</h3>
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 min-h-[300px]">
              {maintenanceBlocks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-xs text-muted italic">No blocks configured.</div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {maintenanceBlocks.map(block => (
                    <div key={block.id} className="border border-border p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground text-sm">{roomTypes.find(r => r.id === block.roomTypeId)?.name || block.roomTypeId}</span>
                        <span className="text-muted block">Blocked: <strong>{block.startDate}</strong> to <strong>{block.endDate}</strong></span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Reason: {block.reason}</span>
                      </div>
                      <button onClick={() => deleteMaintenanceBlock(block.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. FOOD ORDERS TAB */}
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
                    <td colSpan={6} className="p-8 text-center text-muted italic">No food orders recorded.</td>
                  </tr>
                ) : (
                  [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(o => (
                    <tr key={o.id} className="hover:bg-muted-light/30 transition-colors">
                      <td className="p-4 text-foreground font-mono">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-foreground font-bold">Room {o.roomNumber}</td>
                      <td className="p-4 text-foreground">
                        {o.items.map((item, i) => (
                          <div key={i}>x{item.quantity} {item.name}</div>
                        ))}
                      </td>
                      <td className="p-4 text-primary font-bold">NPR {o.totalAmount}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                          o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : o.status === 'Preparing' ? 'bg-amber-500/10 text-amber-800 border-amber-500/20' : 'bg-blue-500/10 text-blue-800 border-blue-500/20'
                        }`}>{o.status}</span>
                      </td>
                      <td className="p-4 font-mono">{o.bookingRef}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-2">
              <span className="text-xs uppercase font-medium text-muted">Lodge Revenue</span>
              <h3 className="text-2xl font-bold text-primary">NPR {revenue.total.toLocaleString()}</h3>
              <div className="text-[10px] text-muted flex flex-col gap-0.5 mt-1 border-t border-border/50 pt-2">
                <span>Room Rentals: NPR {revenue.rooms.toLocaleString()}</span>
                <span>Food Service: NPR {revenue.food.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-medium text-muted">Lodge Occupancy Rate</span>
                <h3 className="text-2xl font-bold text-foreground mt-2">{occupancyRate}%</h3>
              </div>
              <span className="text-[10px] text-muted block mt-2">Active checked-in cottages.</span>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-medium text-muted">Bookings Volume</span>
                <h3 className="text-2xl font-bold text-foreground mt-2">{bookings.length} reservations</h3>
              </div>
              <div className="text-[10px] text-muted flex gap-2 mt-2">
                <span>Paid: {bookings.filter(b => b.paymentStatus === 'Paid').length}</span>
                <span>Pending: {bookings.filter(b => b.paymentStatus === 'Pending').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Room Type Occupancy</h3>
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
                    
                    <div className="w-full bg-muted-light h-3.5 rounded-full overflow-hidden border border-border flex">
                      {activeChecked > 0 && (
                        <div style={{ width: `${(activeChecked / rt.totalUnits) * 100}%` }} className="bg-emerald-600 h-full" title={`Checked in: ${activeChecked}`}></div>
                      )}
                      {activeConfirmed > 0 && (
                        <div style={{ width: `${(activeConfirmed / rt.totalUnits) * 100}%` }} className="bg-primary h-full opacity-70" title={`Confirmed: ${activeConfirmed}`}></div>
                      )}
                      {activeBlocked > 0 && (
                        <div style={{ width: `${(activeBlocked / rt.totalUnits) * 100}%` }} className="bg-amber-500 h-full" title={`Blocked: ${activeBlocked}`}></div>
                      )}
                    </div>
                    <div className="flex gap-4 text-[10px] text-muted">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-600 rounded"></span> Checked In ({activeChecked})</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 bg-primary opacity-70 rounded"></span> Confirmed ({activeConfirmed})</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 bg-amber-500 rounded"></span> Blocked ({activeBlocked})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR BANK screenshot */}
      {viewScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setViewScreenshot(null)}>
          <div className="relative max-w-md w-full bg-card rounded-3xl overflow-hidden shadow-2xl p-4 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Receipt screenshot</span>
              <button onClick={() => setViewScreenshot(null)} className="text-muted hover:text-foreground p-1 rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-black">
              <img src={viewScreenshot} alt="Receipt verification" className="object-contain w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN MODAL */}
      {showWalkin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-primary text-primary-light px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Create Walk-In Reservation</h3>
              <button onClick={() => setShowWalkin(false)} className="text-primary-light/80 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateWalkin} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Room Type</label>
                  <select value={walkinRoom} onChange={(e) => setWalkinRoom(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground cursor-pointer">
                    {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Guests</label>
                  <select value={walkinGuests} onChange={(e) => setWalkinGuests(Number(e.target.value))} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground cursor-pointer">
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Check-In</label>
                  <input type="date" value={walkinIn} onChange={(e) => setWalkinIn(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Check-Out</label>
                  <input type="date" value={walkinOut} onChange={(e) => setWalkinOut(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground" required />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Guest Name</label>
                <input type="text" placeholder="Full Name" value={walkinName} onChange={(e) => setWalkinName(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone</label>
                  <input type="text" placeholder="98XXXXXXXX" value={walkinPhone} onChange={(e) => setWalkinPhone(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email</label>
                  <input type="email" placeholder="email@domain.com" value={walkinEmail} onChange={(e) => setWalkinEmail(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground" required />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Notes</label>
                <textarea placeholder="Special requests..." value={walkinNotes} onChange={(e) => setWalkinNotes(e.target.value)} rows={2} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground resize-none" />
              </div>

              <button type="submit" className="bg-primary hover:bg-primary/95 text-primary-light text-xs font-semibold py-3 rounded-xl shadow-sm mt-2 font-sans">Confirm Reservation</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
