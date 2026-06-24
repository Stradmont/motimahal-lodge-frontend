'use client';

import React, { useState } from 'react';
import { Search, Plus, Calendar, BedDouble, Coffee, BarChart3, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { Booking, RoomType, Order, MaintenanceBlock } from '../../types';
import { Table, ConfigProvider } from 'antd';

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

  // Reports calculations
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

  // ── Ant Design Column Setup ───────────────────────────────────────────────
  
  const bookingsColumns = [
    {
      title: 'Booking Ref',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      render: (text: string) => (
        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{text}</span>
      ),
    },
    {
      title: 'Guest Details',
      key: 'guestDetails',
      render: (_: any, record: Booking) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">{record.guestName}</span>
          <span className="text-micro text-muted font-mono">{record.guestPhone} • {record.guestEmail}</span>
        </div>
      ),
    },
    {
      title: 'Stay Duration',
      key: 'stayDuration',
      render: (_: any, record: Booking) => {
        const nights = Math.ceil((new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime()) / (1000 * 60 * 60 * 24));
        return (
          <div className="flex flex-col text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <span>{record.checkIn} to {record.checkOut}</span>
            <span className="text-micro text-muted font-medium">{nights} Night(s)</span>
          </div>
        );
      },
    },
    {
      title: 'Cottage Type',
      key: 'cottageType',
      render: (_: any, record: Booking) => {
        const rt = roomTypes.find(rt => rt.id === record.roomTypeId);
        return <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">{rt?.name || record.roomTypeId}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-nano font-bold uppercase tracking-wider border ${
          status === 'CheckedIn'
            ? 'bg-zinc-800 text-zinc-50 border-zinc-900 shadow-sm'
            : status === 'Confirmed'
              ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
              : status === 'Pending'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-zinc-50 text-zinc-400 border-zinc-200/80'
        }`}>{status}</span>
      ),
    },
    {
      title: 'Payment Status',
      key: 'paymentDetails',
      render: (_: any, record: Booking) => (
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-nano font-bold uppercase border ${
            record.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>{record.paymentStatus}</span>
          {record.paymentDetails.screenshotUrl && (
            <button 
              onClick={() => setViewScreenshot(record.paymentDetails.screenshotUrl || null)}
              className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200 transition-all cursor-pointer"
              title="View receipt"
            >
              <ImageIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Booking) => (
        <div className="flex justify-end gap-1.5 flex-wrap">
          {record.paymentStatus !== 'Paid' && (
            <button
              onClick={() => updatePaymentStatus(record.id, 'Paid', { method: 'Bank Transfer' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl text-nano font-bold transition-all cursor-pointer"
            >
              Verify Pay
            </button>
          )}

          {record.status === 'Pending' && (
            <button
              onClick={() => updateBookingStatus(record.id, 'Confirmed')}
              className="bg-zinc-800 text-white hover:bg-zinc-950 px-2.5 py-1.5 rounded-xl text-nano font-bold transition-all cursor-pointer"
            >
              Confirm Cottage
            </button>
          )}

          {record.status === 'Confirmed' && (
            <button
              onClick={() => updateBookingStatus(record.id, 'CheckedIn')}
              className="bg-zinc-800 hover:bg-zinc-950 text-white px-2.5 py-1.5 rounded-xl text-nano font-bold transition-all cursor-pointer"
            >
              Check In
            </button>
          )}

          {record.status === 'CheckedIn' && (
            <button
              onClick={() => updateBookingStatus(record.id, 'CheckedOut')}
              className="bg-zinc-950 hover:bg-black text-white px-2.5 py-1.5 rounded-xl text-nano font-bold transition-all cursor-pointer"
            >
              Check Out
            </button>
          )}

          {record.status !== 'CheckedOut' && record.status !== 'Cancelled' && (
            <button
              onClick={() => updateBookingStatus(record.id, 'Cancelled')}
              className="border border-rose-200 hover:bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-xl text-nano font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  const ordersColumns = [
    {
      title: 'Time Placed',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => (
        <span className="font-mono font-semibold text-xs text-zinc-800 dark:text-zinc-200">{new Date(dateStr).toLocaleString()}</span>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (room: string) => (
        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Room {room}</span>
      ),
    },
    {
      title: 'Items Summary',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <div className="flex flex-col gap-0.5 font-medium text-xs text-zinc-800 dark:text-zinc-200">
          {items.map((item, i) => (
            <div key={i}>x{item.quantity} {item.name}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="text-zinc-900 dark:text-zinc-50 font-bold text-xs">NPR {amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-nano font-bold border uppercase tracking-wider ${
          status === 'Delivered'
            ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
            : status === 'Preparing'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-zinc-50 text-zinc-500 border-zinc-200'
        }`}>{status}</span>
      ),
    },
    {
      title: 'Booking Ref',
      dataIndex: 'bookingRef',
      key: 'bookingRef',
      render: (ref: string) => (
        <span className="font-mono font-medium text-xs text-muted">{ref}</span>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#18181b', // Clean professional zinc-800
          colorBgContainer: 'var(--card-bg)',
          colorBorder: 'var(--border-color)',
          colorText: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          borderRadius: 12,
        },
        components: {
          Table: {
            headerBg: 'var(--muted-light)',
            headerColor: 'var(--muted)',
            headerBorderRadius: 12,
            borderColor: 'var(--border-color)',
            rowHoverBg: 'rgba(24, 24, 27, 0.03)',
          }
        }
      }}
    >
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Mobile view sub-tabs layout */}
        <div className="md:hidden flex items-center gap-1 bg-muted-light p-1 rounded-xl border border-border overflow-x-auto">
          {(['bookings', 'rooms', 'orders', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 rounded-lg text-micro font-bold uppercase transition-all ${
                activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-muted'
              }`}
            >
              {tab === 'bookings' ? 'Reservations' : tab === 'rooms' ? 'Maintenance' : tab === 'orders' ? 'Dining' : 'Earnings'}
            </button>
          ))}
        </div>

        {/* 1. BOOKINGS LIST TAB */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-fade-in">
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
                    className="bg-card border border-border focus:border-zinc-800 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs w-full text-foreground"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-card border border-border focus:border-zinc-800 focus:outline-none rounded-xl px-2 py-2 text-xs text-foreground cursor-pointer font-semibold"
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
                className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" /> New Guest Check-in
              </button>
            </div>

            {/* Bookings table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
              <Table 
                dataSource={filteredBookings} 
                columns={bookingsColumns} 
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  className: "px-4 py-3 font-semibold text-xs",
                }}
                className="w-full text-left text-xs border-collapse"
                locale={{
                  emptyText: <span className="font-bold text-muted my-6 block text-xs">No bookings registered yet.</span>
                }}
              />
            </div>
          </div>
        )}

        {/* 2. ROOM BLOCKS TAB */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5">
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-border pb-3">Block Cottages for Maintenance</h3>
                <form onSubmit={handleAddBlock} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Cottage Type</label>
                    <select 
                      value={blockType}
                      onChange={(e) => setBlockType(e.target.value)}
                      className="bg-muted-light border border-border focus:border-zinc-800 rounded-xl p-2.5 text-xs text-foreground cursor-pointer font-bold"
                    >
                      {roomTypes.map(rt => (
                        <option key={rt.id} value={rt.id}>{rt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-micro font-bold text-muted uppercase tracking-wider">Start Date</label>
                      <input type="date" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-semibold" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-micro font-bold text-muted uppercase tracking-wider">End Date</label>
                      <input type="date" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-semibold" required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Reason / Issue</label>
                    <input type="text" placeholder="AC Repair / Clay Plaster Maintenance" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground w-full font-semibold" required />
                  </div>
                  <button type="submit" className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold py-3 rounded-xl shadow-sm transition-all cursor-pointer">Apply Cottage Block</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Cottages Under Maintenance</h3>
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4 min-h-[300px]">
                {maintenanceBlocks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center text-xs text-muted font-bold">All cottages are currently open for guests.</div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                    {maintenanceBlocks.map(block => (
                      <div key={block.id} className="border border-border p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">{roomTypes.find(r => r.id === block.roomTypeId)?.name || block.roomTypeId}</span>
                          <span className="text-muted block font-medium">Blocked: <strong>{block.startDate}</strong> to <strong>{block.endDate}</strong></span>
                          <span className="text-micro text-amber-700 font-bold">Issue: {block.reason}</span>
                        </div>
                        <button onClick={() => deleteMaintenanceBlock(block.id)} className="p-2 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl transition-all cursor-pointer"><Trash2 className="h-4 w-4" /></button>
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
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs animate-fade-in">
            <Table 
              dataSource={[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
              columns={ordersColumns} 
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                className: "px-4 py-3 font-semibold text-xs",
              }}
              className="w-full text-left text-xs border-collapse"
              locale={{
                emptyText: <span className="font-bold text-muted my-6 block text-xs">No dining orders recorded.</span>
              }}
            />
          </div>
        )}

        {/* 4. REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col gap-2">
                <span className="text-xs uppercase font-bold text-muted">Total Lodge Earnings</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">NPR {revenue.total.toLocaleString()}</h3>
                <div className="text-micro text-muted flex flex-col gap-0.5 mt-1 border-t border-border/50 pt-2 font-medium">
                  <span>Cottage Bookings: NPR {revenue.rooms.toLocaleString()}</span>
                  <span>Dining Sales: NPR {revenue.food.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-muted">Current Occupancy</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">{occupancyRate}%</h3>
                </div>
                <span className="text-micro text-muted block mt-2 font-medium">Active checked-in cottages.</span>
              </div>

              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-muted">Total Bookings</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">{bookings.length} reservations</h3>
                </div>
                <div className="text-micro text-muted flex gap-2 mt-2 font-semibold">
                  <span>Paid: {bookings.filter(b => b.paymentStatus === 'Paid').length}</span>
                  <span>Pending: {bookings.filter(b => b.paymentStatus === 'Pending').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-border pb-3">Occupancy by Cottage Type</h3>
              <div className="flex flex-col gap-6 mt-2">
                {roomTypes.map((rt) => {
                  const activeChecked = bookings.filter(b => b.roomTypeId === rt.id && b.status === 'CheckedIn').length;
                  const activeConfirmed = bookings.filter(b => b.roomTypeId === rt.id && b.status === 'Confirmed').length;
                  const activeBlocked = maintenanceBlocks.filter(m => m.roomTypeId === rt.id).length;
                  
                  const occupiedUnits = activeChecked + activeConfirmed + activeBlocked;
                  const occupancyPercent = Math.min(Math.round((occupiedUnits / rt.totalUnits) * 100), 100);

                  return (
                    <div key={rt.id} className="flex flex-col gap-1.5 text-xs text-muted font-medium">
                      <div className="flex justify-between items-end font-bold text-zinc-800 dark:text-zinc-200">
                        <span>{rt.name}</span>
                        <span>{occupiedUnits} / {rt.totalUnits} Units Occupied ({occupancyPercent}%)</span>
                      </div>
                      
                      <div className="w-full bg-muted-light h-3.5 rounded-full overflow-hidden border border-border flex">
                        {activeChecked > 0 && (
                          <div style={{ width: `${(activeChecked / rt.totalUnits) * 100}%` }} className="bg-zinc-700 h-full" title={`Checked in: ${activeChecked}`}></div>
                        )}
                        {activeConfirmed > 0 && (
                          <div style={{ width: `${(activeConfirmed / rt.totalUnits) * 100}%` }} className="bg-zinc-400 h-full" title={`Confirmed: ${activeConfirmed}`}></div>
                        )}
                        {activeBlocked > 0 && (
                          <div style={{ width: `${(activeBlocked / rt.totalUnits) * 100}%` }} className="bg-zinc-350 h-full" title={`Blocked: ${activeBlocked}`}></div>
                        )}
                      </div>
                      <div className="flex gap-4 text-micro text-muted font-bold uppercase tracking-wider mt-1">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-zinc-700 rounded"></span> Checked In ({activeChecked})</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-zinc-400 rounded"></span> Confirmed ({activeConfirmed})</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-zinc-300 rounded"></span> Blocked ({activeBlocked})</span>
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
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setViewScreenshot(null)}>
            <div className="relative max-w-md w-full bg-card rounded-3xl overflow-hidden shadow-2xl p-4 border border-border" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">Receipt screenshot</span>
                <button onClick={() => setViewScreenshot(null)} className="text-muted hover:text-foreground p-1 rounded-md cursor-pointer"><X className="h-4 w-4" /></button>
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
            <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="bg-zinc-800 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider font-serif">New Walk-In Reservation</h3>
                <button onClick={() => setShowWalkin(false)} className="text-white/80 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleCreateWalkin} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Cottage Type</label>
                    <select value={walkinRoom} onChange={(e) => setWalkinRoom(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground cursor-pointer font-semibold">
                      {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Guests</label>
                    <select value={walkinGuests} onChange={(e) => setWalkinGuests(Number(e.target.value))} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground cursor-pointer font-semibold">
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Check-In Date</label>
                    <input type="date" value={walkinIn} onChange={(e) => setWalkinIn(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-semibold" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Check-Out Date</label>
                    <input type="date" value={walkinOut} onChange={(e) => setWalkinOut(e.target.value)} className="bg-muted-light border border-border rounded-xl p-2.5 text-xs text-foreground font-semibold" required />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-micro font-bold text-muted uppercase tracking-wider">Guest Name</label>
                  <input type="text" placeholder="Full Name" value={walkinName} onChange={(e) => setWalkinName(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-semibold" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Phone</label>
                    <input type="text" placeholder="98XXXXXXXX" value={walkinPhone} onChange={(e) => setWalkinPhone(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-semibold font-mono" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-micro font-bold text-muted uppercase tracking-wider">Email</label>
                    <input type="email" placeholder="email@domain.com" value={walkinEmail} onChange={(e) => setWalkinEmail(e.target.value)} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-semibold" required />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-micro font-bold text-muted uppercase tracking-wider">Notes / Special Requests</label>
                  <textarea placeholder="Special instructions (dietary, bedding, etc.)..." value={walkinNotes} onChange={(e) => setWalkinNotes(e.target.value)} rows={2} className="bg-muted-light border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground resize-none font-semibold" />
                </div>

                <button type="submit" className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold py-3 rounded-xl shadow-sm mt-2 cursor-pointer">Confirm Reservation</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </ConfigProvider>
  );
}
