'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Search, Plus, Minus, X,
  ShoppingBag, ArrowRight, Check,
} from 'lucide-react';

export default function FoodMenuPage() {
  const {
    currentBooking, currentRoomNumber, foodItems, cart,
    addToCart, updateCartQuantity, removeFromCart, placeOrder, isLoaded,
  } = useApp();
  const cartPanelRef = useRef<HTMLDivElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery]       = useState<string>('');
  const [orderSuccess, setOrderSuccess]     = useState(false);
  const [placedOrderId, setPlacedOrderId]   = useState('');
  const [customRoom, setCustomRoom]         = useState('');

  const categories = ['All', 'Momo', 'Thali', 'Snacks', 'Beverages'];

  const filteredItems = foodItems.filter((item) => {
    if (!item.isAvailable) return false;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch   = item.name.toLowerCase().includes(searchQuery.toLowerCase())
                         || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal     = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const targetRoom    = customRoom || currentRoomNumber || '101';
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const scrollToCart = () =>
    cartPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const order = placeOrder(targetRoom);
    if (order) { setPlacedOrderId(order.id); setOrderSuccess(true); }
  };

  const handleAddAndOrder = (item: (typeof foodItems)[number]) => {
    addToCart(item, 1);
    requestAnimationFrame(() => scrollToCart());
  };

  const handleResetSuccess = () => {
    setOrderSuccess(false);
    setPlacedOrderId('');
    setCustomRoom('');
  };

  return (
    <div className="flex flex-col flex-1 bg-background">

      {/* Page header */}
      <div className="border-b border-border px-4 sm:px-6 lg:px-8 py-10 bg-card">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent mb-3">
            Ghar ko Khana
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Our Food Menu
          </h1>
          <p className="text-sm text-muted max-w-lg leading-relaxed">
            Everything is cooked fresh each day. Dine in the garden or order to your cottage veranda.
          </p>
        </div>
      </div>

      {/* Main */}
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10"
        id="menu-grid"
      >

        {/* Left: menu */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-light'
                      : 'bg-muted-light text-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-card border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:border-primary-accent transition-colors"
              />
            </div>
          </div>

          {/* Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {isLoaded && filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col border border-border rounded-2xl overflow-hidden bg-card hover:border-primary-accent transition-colors duration-300"
              >
                {/* Photo */}
                <div className="relative h-48 w-full overflow-hidden bg-muted-light shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted/20 text-xs">
                      No photo
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide bg-card/90 text-muted px-2.5 py-1 rounded-full border border-border/50">
                    {item.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary-accent transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-sm font-bold text-primary shrink-0 tabular-nums">
                      NPR {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border/60">
                    {currentBooking ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted-light text-muted text-xs font-semibold hover:bg-border/50 transition-colors cursor-pointer border border-border/40"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                        <button
                          onClick={() => handleAddAndOrder(item)}
                          className="flex items-center justify-center py-2.5 rounded-xl bg-primary text-primary-light text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          Order now
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/portal"
                        className="block w-full text-center py-2.5 rounded-xl bg-muted-light text-muted text-xs font-semibold hover:bg-border/50 transition-colors"
                      >
                        Login to order
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoaded && filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center gap-3">
                <p className="text-sm font-semibold text-foreground">Nothing found</p>
                <p className="text-xs text-muted">Try a different category or clear your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: cart / callout */}
        <div className="lg:col-span-4" ref={cartPanelRef}>
          {isLoaded && currentBooking ? (
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-5 sticky top-24">
              {orderSuccess ? (
                /* Success */
                <div className="text-center py-10 flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Order sent to kitchen</p>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      Preparing for Room <strong>{targetRoom}</strong>. Check your guest screen for updates.
                    </p>
                  </div>
                  <button
                    onClick={handleResetSuccess}
                    className="btn-luxury-primary w-full cursor-pointer"
                  >
                    Order more
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary-accent" />
                      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
                        Your order
                      </h2>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="text-[10px] font-bold bg-primary text-primary-light px-2.5 py-1 rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <ShoppingBag className="h-10 w-10 text-muted/20" />
                      <p className="text-xs text-muted">Your order is empty.</p>
                      <p className="text-[10px] text-muted/60">Add a dish from the menu.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">

                      {/* Room input */}
                      <div className="flex items-center gap-3 bg-muted-light rounded-xl px-4 py-3 border border-border/50">
                        <span className="text-xs text-muted shrink-0">Room</span>
                        <input
                          type="text"
                          value={targetRoom}
                          onChange={(e) => setCustomRoom(e.target.value)}
                          placeholder="101"
                          className="flex-1 bg-transparent text-xs font-bold text-foreground focus:outline-none text-center"
                        />
                      </div>

                      {/* Cart items */}
                      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.foodItemId} className="flex items-center gap-3 text-xs">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">{item.name}</p>
                              <p className="text-muted tabular-nums">NPR {item.price}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1 shrink-0">
                              <button
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity - 1)}
                                className="text-muted hover:text-foreground transition-colors cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold w-4 text-center tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity + 1)}
                                className="text-muted hover:text-foreground transition-colors cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.foodItemId)}
                              className="text-muted hover:text-red-500 transition-colors cursor-pointer p-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Bill */}
                      <div className="border-t border-border pt-4 flex flex-col gap-2 text-xs">
                        <div className="flex justify-between text-muted">
                          <span>Subtotal</span>
                          <span className="font-semibold text-foreground tabular-nums">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted">
                          <span>Room delivery</span>
                          <span className="font-semibold text-emerald-600">Free</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-2 mt-1">
                          <span>Total</span>
                          <span className="text-primary tabular-nums">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="btn-luxury-primary w-full cursor-pointer"
                      >
                        Send to kitchen <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Not logged in */
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 sticky top-24">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent mb-2">
                  In-room dining
                </p>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  Order to your veranda
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Staying with us? Log in with your booking code to order
                  fresh food delivered hot to your cottage veranda.
                </p>
              </div>

              <ul className="flex flex-col gap-2.5 text-xs text-muted">
                {[
                  'Home-cooked local meals',
                  'Delivered to your cottage porch',
                  'Pay via eSewa or at check-out',
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-accent shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              <Link href="/portal" className="btn-luxury-primary w-full text-center cursor-pointer">
                Log in to order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
