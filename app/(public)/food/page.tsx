'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  Coffee, Utensils, Search, Plus, Minus, X, 
  ShoppingBag, ArrowRight, UserCheck, Check, ChefHat, Clock3, Sparkles
} from 'lucide-react';

export default function FoodMenuPage() {
  const { 
    currentBooking, currentRoomNumber, foodItems, cart, 
    addToCart, updateCartQuantity, removeFromCart, placeOrder, isLoaded 
  } = useApp();
  const cartPanelRef = useRef<HTMLDivElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [customRoom, setCustomRoom] = useState('');

  // Categories list
  const categories = ['All', 'Momo', 'Thali', 'Snacks', 'Beverages'];

  // Filter items based on active category & search query
  const filteredItems = foodItems.filter(item => {
    if (!item.isAvailable) return false;
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const targetRoom = customRoom || currentRoomNumber || '101';
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCart = () => {
    cartPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    const order = placeOrder(targetRoom);
    if (order) {
      setPlacedOrderId(order.id);
      setOrderSuccess(true);
    }
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
    <div className="flex flex-col flex-1">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=1920')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto mt-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-5 font-medium flex items-center gap-2">
            <ChefHat className="h-4 w-4" /> Motimahal Lodge Restaurant
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
            Our Menu
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/60 font-normal leading-relaxed max-w-lg">
            Freshly prepared Nepalese dishes, crafted for dine-in, cottage delivery, and guest-room service.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {currentBooking ? (
              <>
                <button
                  onClick={scrollToCart}
                  className="bg-primary hover:bg-primary/90 text-primary-light font-semibold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  Order Now <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="#menu-grid"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-sm px-6 py-3 rounded-xl transition-all backdrop-blur-sm"
                >
                  Browse Menu
                </Link>
              </>
            ) : (
              <Link
                href="/portal"
                className="bg-primary hover:bg-primary/90 text-primary-light font-semibold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                Login to Order <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8" id="menu-grid">
        
        {/* Left side: Menu items */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center border-b border-border pb-6">
            
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-nowrap shrink-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-primary text-primary-light'
                      : 'bg-muted-light text-muted hover:text-foreground hover:bg-border/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[200px] w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted/60" />
              <input 
                type="text" 
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted-light border border-transparent focus:bg-background focus:border-primary focus:outline-none rounded-xl pl-9 pr-10 py-2 text-sm text-foreground w-full transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {isLoaded && filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift flex flex-col shadow-sm"
              >
                {/* Photo */}
                <div className="relative h-56 w-full bg-muted-light overflow-hidden">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Coffee className="h-10 w-10 text-muted/30" />
                    </div>
                  )}
                  {/* Category */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium text-white tracking-wide">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-sm font-bold text-primary shrink-0">
                      NPR {item.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {currentBooking ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button 
                        onClick={() => addToCart(item, 1)}
                        className="w-full bg-muted-light hover:bg-muted text-muted-foreground font-medium py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                      <button 
                        onClick={() => handleAddAndOrder(item)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-light font-medium py-2 rounded-xl text-xs transition-colors flex items-center justify-center"
                      >
                        Order Now
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                       <Link
                         href="/portal"
                         className="block w-full text-center bg-muted-light hover:bg-border/50 text-muted font-medium py-2 rounded-xl text-xs transition-colors"
                       >
                         Login to Order
                       </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoaded && filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-sm text-muted flex flex-col items-center gap-3">
                <Utensils className="h-8 w-8 opacity-40" />
                <p className="font-medium text-foreground">No dishes found</p>
                <p className="text-xs">Try refining your search terms or selecting another category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Cart */}
        <div className="lg:col-span-4" ref={cartPanelRef}>
          {isLoaded && currentBooking ? (
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              {orderSuccess ? (
                /* Success */
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <Check className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Order Sent!</h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      Order #{placedOrderId.slice(-4).toUpperCase()} is being prepared for Room {targetRoom}. Track status in your guest dashboard.
                    </p>
                  </div>
                  <button 
                    onClick={handleResetSuccess}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-light py-2.5 rounded-xl text-sm font-medium transition-all mt-4"
                  >
                    Order Something Else
                  </button>
                </div>
              ) : (
                /* Cart */
                <>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Your Order</h2>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="text-[10px] bg-primary text-primary-light px-2.5 py-0.5 rounded-full font-bold">
                        {cartItemCount} Items
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <ShoppingBag className="h-10 w-10 text-muted/20" />
                      <p className="text-sm text-muted">Your cart is empty.</p>
                      <p className="text-xs text-muted/70">Add some delicious items from the menu!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      
                      {/* Room delivery input */}
                      <div className="bg-muted-light p-4 rounded-xl border border-border flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Deliver to Room:</span>
                          <input 
                            type="text" 
                            value={targetRoom}
                            onChange={(e) => setCustomRoom(e.target.value)}
                            placeholder="Room #"
                            className="bg-card border border-border rounded-lg px-2 py-1.5 w-16 text-center font-bold text-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <span className="text-[10px] text-muted italic">Orders will deliver to Room {targetRoom} after confirmation.</span>
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                        {cart.map((item) => (
                          <div key={item.foodItemId} className="flex justify-between items-center gap-3 text-sm">
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="font-semibold text-foreground truncate">{item.name}</span>
                              <span className="text-[10px] text-muted font-medium">NPR {item.price}</span>
                            </div>
                            
                            {/* Quantity */}
                            <div className="flex items-center gap-2 bg-muted-light border border-border px-1.5 py-1 rounded-lg shrink-0">
                              <button 
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity - 1)}
                                className="text-muted hover:text-foreground hover:bg-border/80 rounded p-0.5 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold font-mono text-[11px] text-foreground w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity + 1)}
                                className="text-muted hover:text-foreground hover:bg-border/80 rounded p-0.5 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.foodItemId)}
                              className="text-muted hover:text-red-500 shrink-0 p-1 transition-colors"
                              title="Remove"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-border my-1"></div>

                      {/* Summary */}
                      <div className="flex flex-col gap-2 text-xs text-muted">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-medium text-foreground">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span className="font-medium text-foreground">Free</span>
                        </div>
                        <div className="h-px bg-border my-1"></div>
                        <div className="flex justify-between text-sm text-foreground font-semibold">
                          <span>Total Amount</span>
                          <span className="text-primary font-bold">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-light py-3 rounded-xl font-semibold text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        Confirm Order <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Guest Portal ad */
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-2">Guest Services</p>
                <h3 className="text-xl font-semibold text-foreground leading-tight">
                  In-Room Dining
                </h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Staying at Motimahal Lodge? Login to your guest portal to order fresh meals directly to your room.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-sm text-muted">
                {[
                  { icon: ChefHat, text: 'Cooked fresh to order' },
                  { icon: Clock3, text: 'Fast delivery to your room' },
                  { icon: UserCheck, text: 'Charged to your checkout bill' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-4 w-4" />
                    </span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/portal" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-light py-3 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                Login to Order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
