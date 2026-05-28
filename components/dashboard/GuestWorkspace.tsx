'use client';

import React, { useState } from 'react';
import { LogIn, Key, Phone, User, Clock, Check, Sparkles, Plus, Minus, X, Coffee, ShoppingBag } from 'lucide-react';
import { Booking, RoomType, Order, FoodItem } from '../../types';

interface GuestWorkspaceProps {
  currentBooking: Booking | null;
  currentRoomNumber: string | null;
  loginGuest: (ref: string, phone: string) => boolean;
  logoutGuest: () => void;
  orders: Order[];
  roomTypes: RoomType[];
  foodItems: FoodItem[];
  cart: any[];
  addToCart: (item: any, qty: number) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  placeOrder: (roomNum: string) => any;
  activeTab: 'stay' | 'orderFood' | 'requests' | 'orders';
  setActiveTab: (tab: 'stay' | 'orderFood' | 'requests' | 'orders') => void;
}

export default function GuestWorkspace({
  currentBooking,
  currentRoomNumber,
  loginGuest,
  logoutGuest,
  orders,
  roomTypes,
  foodItems,
  cart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  placeOrder,
  activeTab,
  setActiveTab
}: GuestWorkspaceProps) {

  // Login form states
  const [refNum, setRefNum] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Service requests
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Ordering inline states
  const [foodCategory, setFoodCategory] = useState('All');
  const [foodSearch, setFoodSearch] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginGuest(refNum, phone);
    if (!success) {
      setLoginError('Invalid reference or phone number. Try MM-2026-0001 & 9841234567.');
    }
  };

  const handleServiceRequest = (service: string) => {
    setRequestStatus(`Request for "${service}" has been sent to the front desk. Staff will be at Room ${currentRoomNumber} shortly!`);
    setTimeout(() => setRequestStatus(null), 5000);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const room = currentRoomNumber || '101';
    const order = placeOrder(room);
    if (order) {
      setPlacedOrderId(order.id);
      setOrderSuccess(true);
    }
  };

  const guestOrders = currentBooking 
    ? orders.filter(o => o.bookingRef === currentBooking.referenceNumber)
    : [];

  const filteredFoodItems = foodItems.filter(item => {
    if (!item.isAvailable) return false;
    const matchesCategory = foodCategory === 'All' || item.category === foodCategory;
    const matchesSearch = item.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(foodSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* 1. NOT LOGGED IN STATE */}
      {!currentBooking ? (
        <div className="max-w-md w-full mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary mx-auto mb-3 border border-primary-accent/40">
              <Key className="h-5.5 w-5.5" />
            </span>
            <h2 className="text-xl font-medium text-foreground">Guest Verification</h2>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Please verify your active booking reference to unlock room requests, housekeeping services, and direct restaurant order checkout.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3 w-3 text-primary" /> Booking Reference
              </label>
              <input 
                type="text" 
                placeholder="e.g. MM-2026-0001"
                value={refNum}
                onChange={(e) => setRefNum(e.target.value)}
                className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-2.5 text-xs text-foreground w-full font-mono"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3 w-3 text-primary" /> Phone Number
              </label>
              <input 
                type="text" 
                placeholder="e.g. 9841234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-2.5 text-xs text-foreground w-full font-mono"
                required
              />
            </div>

            {loginError && (
              <span className="text-[11px] text-red-700 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl font-semibold">
                {loginError}
              </span>
            )}

            <button type="submit" className="w-full bg-primary hover:bg-primary/95 text-primary-light font-medium text-xs py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
              <LogIn className="h-4 w-4" />
              <span>Authenticate Stay</span>
            </button>
          </form>

          <div className="bg-primary-light border border-primary-accent/40 rounded-2xl p-4 mt-6 text-[11px] text-muted leading-relaxed">
            <strong>Pre-Seeded Guest Credentials:</strong>
            <div className="font-mono text-foreground mt-1">
              Ref: <span className="font-bold">MM-2026-0001</span><br />
              Phone: <span className="font-bold">9841234567</span>
            </div>
          </div>
        </div>
      ) : (
        
        /* 2. AUTHENTICATED WORKSPACE VIEW */
        <div className="flex flex-col gap-6">
          {/* Mobile sub-tabs selector */}
          <div className="md:hidden flex gap-1 bg-muted-light p-1 rounded-xl border border-border overflow-x-auto">
            {(['stay', 'orderFood', 'requests', 'orders'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap px-3 ${
                  activeTab === tab ? 'bg-primary text-primary-light' : 'text-muted'
                }`}
              >
                {tab === 'stay' ? 'Stay' : tab === 'orderFood' ? 'Order' : tab === 'requests' ? 'Service' : 'Orders'}
              </button>
            ))}
          </div>

          {requestStatus && (
            <div className="p-4 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 rounded-2xl text-xs font-semibold animate-pulse">
              {requestStatus}
            </div>
          )}

          {/* TAB 1: STAY SUMMARY */}
          {activeTab === 'stay' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Booking Stay Details</h3>
              <div className="flex gap-2 items-center">
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">{currentBooking.status}</span>
                <span className="text-xs text-muted font-medium">• Ref: {currentBooking.referenceNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mt-2 border-t border-border/40 pt-4 text-muted">
                <div>
                  <span className="text-muted block uppercase tracking-wider text-[9px] font-semibold">Check-In Date</span>
                  <span className="font-semibold text-sm text-foreground mt-0.5 block">{currentBooking.checkIn}</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider text-[9px] font-semibold">Check-Out Date</span>
                  <span className="font-semibold text-sm text-foreground mt-0.5 block">{currentBooking.checkOut}</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider text-[9px] font-semibold">Total Guests</span>
                  <span className="font-semibold text-sm text-foreground mt-0.5 block">{currentBooking.numGuests} Guest(s)</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider text-[9px] font-semibold">Cottage Type</span>
                  <span className="font-semibold text-sm text-foreground mt-0.5 block">{roomTypes.find(rt => rt.id === currentBooking.roomTypeId)?.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INLINE FOOD ORDERING */}
          {activeTab === 'orderFood' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {orderSuccess ? (
                <div className="col-span-full bg-card border border-border rounded-3xl p-8 text-center flex flex-col items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Order Transmitted to Kitchen!</h3>
                  <p className="text-xs text-muted max-w-sm">Order #{placedOrderId.slice(-4).toUpperCase()} has been printed inside the KDS queue and will deliver to Cottage Room {currentRoomNumber} shortly!</p>
                  <button onClick={() => { setOrderSuccess(false); setPlacedOrderId(''); }} className="bg-primary hover:bg-primary/95 text-primary-light py-2 px-6 rounded-xl text-xs font-semibold shadow transition-all font-sans">Order More Food</button>
                </div>
              ) : (
                <>
                  {/* Menu catalog */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                      <div className="flex gap-1 overflow-x-auto pb-1">
                        {['All', 'Momo', 'Thali', 'Snacks', 'Beverages'].map(cat => (
                          <button key={cat} onClick={() => setFoodCategory(cat)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${foodCategory === cat ? 'bg-primary text-primary-light' : 'text-muted hover:bg-muted-light'}`}>{cat}</button>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search menu..."
                        value={foodSearch}
                        onChange={(e) => setFoodSearch(e.target.value)}
                        className="bg-muted-light border border-border focus:border-primary focus:outline-none rounded-xl px-3 py-1.5 text-xs text-foreground shrink-0 w-32 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                      {filteredFoodItems.map(item => (
                        <div key={item.id} className="bg-card border border-border p-3.5 rounded-xl flex items-center gap-3 justify-between text-xs hover:border-primary/30 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                            <span className="text-[10px] text-muted block mt-0.5 font-medium">NPR {item.price} • {item.category}</span>
                          </div>
                          <button onClick={() => addToCart(item, 1)} className="bg-primary hover:bg-primary/95 text-primary-light px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all shrink-0 font-sans">
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cart check panel */}
                  <div className="lg:col-span-5">
                    <div className="bg-card border border-border rounded-3xl p-5 shadow-lg flex flex-col gap-4">
                      <span className="text-[10px] uppercase font-bold text-muted border-b border-border pb-2 block">Room Service Cart</span>
                      
                      {cart.length === 0 ? (
                        <span className="text-xs text-muted block py-4 text-center">Your cart is empty.</span>
                      ) : (
                        <div className="flex flex-col gap-3.5">
                          <div className="flex flex-col gap-2.5 max-h-[150px] overflow-y-auto pr-1">
                            {cart.map(item => (
                              <div key={item.foodItemId} className="flex justify-between items-center gap-2 text-xs">
                                <span className="font-semibold text-foreground truncate flex-1 leading-normal">{item.name}</span>
                                <div className="flex items-center gap-2 bg-muted-light border border-border p-0.5 rounded-md shrink-0">
                                  <button onClick={() => updateCartQuantity(item.foodItemId, item.quantity - 1)} className="text-muted hover:text-foreground rounded p-0.5"><Minus className="h-2.5 w-2.5" /></button>
                                  <span className="font-bold text-[10px] w-2 text-center">{item.quantity}</span>
                                  <button onClick={() => updateCartQuantity(item.foodItemId, item.quantity + 1)} className="text-muted hover:text-foreground rounded p-0.5"><Plus className="h-2.5 w-2.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="h-px bg-border"></div>
                          <div className="flex justify-between text-xs font-bold text-foreground">
                            <span>Subtotal:</span>
                            <span className="text-primary font-bold">NPR {cartTotal.toLocaleString()}</span>
                          </div>
                          <button onClick={handlePlaceOrder} className="w-full bg-primary hover:bg-primary/95 text-primary-light py-2 rounded-xl text-xs font-semibold shadow transition-all font-sans">Place Room Order</button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: HOUSEKEEPING */}
          {activeTab === 'requests' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Room Service Requests</h3>
              <p className="text-xs text-muted leading-relaxed">Request amenities or front desk housekeeping support at the click of a button.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <button onClick={() => handleServiceRequest('Clean Room / General Housekeeping')} className="p-4 bg-muted-light border border-border hover:border-primary/50 hover:bg-card text-left rounded-2xl transition-all">
                  <Sparkles className="h-5 w-5 text-primary mb-2 animate-pulse" />
                  <h4 className="text-xs font-bold">Housekeeping</h4>
                  <span className="text-[10px] text-muted block mt-1 leading-normal">Request sheets refreshment and room sanitization.</span>
                </button>
                <button onClick={() => handleServiceRequest('Fresh Towels and Toiletries')} className="p-4 bg-muted-light border border-border hover:border-primary/50 hover:bg-card text-left rounded-2xl transition-all">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <h4 className="text-xs font-bold">Amenities request</h4>
                  <span className="text-[10px] text-muted block mt-1 leading-normal">Request dry towels, soap, shampoo, or cold water.</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider border-b border-border pb-3">Order History & Status</h3>
              {guestOrders.length === 0 ? (
                <span className="text-xs text-muted block py-6 text-center">No orders recorded for this booking stay.</span>
              ) : (
                <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                  {guestOrders.map((order) => (
                    <div key={order.id} className="border border-border p-3.5 rounded-2xl flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted">Ticket #{order.id.slice(-4).toUpperCase()}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : 'bg-amber-500/10 text-amber-800 border-amber-500/20'
                        }`}>{order.status}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-border/30 pt-2 text-muted">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name} <strong>x{item.quantity}</strong></span>
                            <span>NPR {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="h-px bg-border/40 my-0.5"></div>
                      <div className="flex justify-between items-center text-foreground font-semibold text-[11px]">
                        <span className="text-[9px] text-muted">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Total: NPR {order.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
