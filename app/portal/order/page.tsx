'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { FoodItemCategory } from '../../../types';
import { ArrowLeft, ShoppingBag, Plus, Minus, X, AlertTriangle, Coffee, Compass, ArrowRight } from 'lucide-react';

export default function OrderFoodPage() {
  const router = useRouter();
  const { 
    currentBooking, currentRoomNumber, foodItems, cart, 
    addToCart, updateCartQuantity, removeFromCart, placeOrder, isLoaded 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [customRoom, setCustomRoom] = useState('');

  // Access check
  if (isLoaded && !currentBooking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-muted mb-6">Please log in to your guest portal using your booking reference to order food to your room.</p>
        <Link 
          href="/portal" 
          className="inline-flex px-6 py-2.5 rounded-xl bg-primary text-primary-light hover:bg-primary/95 text-xs font-semibold transition-all shadow-md"
        >
          Go to Portal Login
        </Link>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Categories list
  const categories = ['All', 'Momo', 'Thali', 'Snacks', 'Beverages'];

  // Filter items
  const filteredItems = foodItems.filter(item => {
    if (!item.isAvailable) return false;
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const targetRoom = customRoom || currentRoomNumber || '101';

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    const order = placeOrder(targetRoom);
    if (order) {
      setPlacedOrderId(order.id);
      setOrderSuccess(true);
    }
  };

  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Order Sent to Kitchen!</h1>
          <p className="text-xs text-muted mt-2">
            Order #{placedOrderId.slice(-4).toUpperCase()} is being prepared for Delivery to <strong>Room {targetRoom}</strong>.
          </p>
        </div>

        <div className="bg-primary-light/50 border border-primary-accent/40 rounded-2xl p-4 text-xs text-muted w-full text-left">
          <h4 className="font-semibold text-primary mb-1">Track in Portal</h4>
          <span>You can monitor the status of this order (Placed → Preparing → Delivered) directly inside your Guest Portal.</span>
        </div>

        <Link 
          href="/portal" 
          className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-primary-light hover:bg-primary/95 text-xs font-semibold transition-all shadow-md"
        >
          <span>Back to Guest Portal</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
      
      {/* Back to Portal button */}
      <Link 
        href="/portal" 
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to guest portal
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Menu Items & Navigation */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase font-medium tracking-wider text-primary">In-Room Dining</span>
            <h1 className="text-3xl font-medium tracking-tight text-foreground">Room Service Menu</h1>
            <p className="text-xs text-muted">Fresh local food prepared by our lodge kitchen. Delivered to Room {currentRoomNumber}.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-light shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-muted-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-card border border-border rounded-2xl overflow-hidden hover-lift flex flex-col sm:flex-row h-full"
              >
                {/* Image */}
                {item.image ? (
                  <div className="relative h-40 sm:h-auto sm:w-1/3 shrink-0 bg-muted-light">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 640px) 100vw, 150px"
                    />
                  </div>
                ) : (
                  <div className="h-40 sm:h-auto sm:w-1/3 shrink-0 bg-muted-light flex items-center justify-center text-muted">
                    <Coffee className="h-8 w-8 opacity-45" />
                  </div>
                )}

                {/* Info & Action */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground leading-snug">{item.name}</h3>
                      <span className="text-xs font-bold text-primary shrink-0">NPR {item.price}</span>
                    </div>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <button 
                    onClick={() => addToCart(item, 1)}
                    className="w-full bg-muted-light hover:bg-primary hover:text-primary-light border border-border hover:border-primary text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Checkout / Cart Panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider">Your Order Cart</h2>
              </div>
              {cart.length > 0 && (
                <span className="text-[10px] bg-primary text-primary-light px-2 py-0.5 rounded-full font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-muted/40" />
                <p className="text-xs text-muted">Your cart is empty. Add delicious momos or thali meals to get started!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                
                {/* Delivery details */}
                <div className="bg-muted-light p-3.5 rounded-xl border border-border text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Deliver to Room:</span>
                    <input 
                      type="text" 
                      value={targetRoom}
                      onChange={(e) => setCustomRoom(e.target.value)}
                      placeholder="e.g. 102"
                      className="border border-border/80 rounded-md px-2 py-0.5 w-16 text-center font-bold text-foreground focus:outline-none focus:border-primary bg-background"
                    />
                  </div>
                  <span className="text-[10px] text-muted italic">Orders will print in the kitchen marked "Room {targetRoom}".</span>
                </div>

                {/* Items list */}
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.foodItemId} className="flex justify-between items-center gap-3 text-xs">
                      <div className="flex-1 flex flex-col">
                        <span className="font-semibold text-foreground truncate">{item.name}</span>
                        <span className="text-[10px] text-muted">NPR {item.price} each</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2.5 bg-muted-light border border-border p-1 rounded-lg">
                        <button 
                          onClick={() => updateCartQuantity(item.foodItemId, item.quantity - 1)}
                          className="text-muted hover:text-foreground hover:bg-border/60 rounded p-0.5"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold font-mono text-[11px] text-foreground w-3 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.foodItemId, item.quantity + 1)}
                          className="text-muted hover:text-foreground hover:bg-border/60 rounded p-0.5"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.foodItemId)}
                        className="text-muted hover:text-red-500 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border my-1"></div>

                {/* Pricing Summary */}
                <div className="flex flex-col gap-1.5 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Food Subtotal</span>
                    <span className="font-medium text-foreground">NPR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lodge Room Service Tax (0%)</span>
                    <span className="font-medium text-foreground">NPR 0</span>
                  </div>
                  <div className="h-px bg-border/80 my-1"></div>
                  <div className="flex justify-between text-sm text-foreground font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary font-bold">NPR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order */}
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-light py-3 rounded-xl font-medium text-sm transition-all shadow-md mt-2"
                >
                  Confirm Room Order
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
