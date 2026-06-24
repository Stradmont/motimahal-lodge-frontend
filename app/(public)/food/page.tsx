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
    <div className="flex flex-col flex-1 bg-background">
      
      {/* ── HERO BANNER ── */}
      <section className="banner-luxury">
        <div
          className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=1600')]"
        />
        
        <div className="relative max-w-3xl z-10">
          <span className="badge-luxury mb-4">
            <ChefHat className="h-3.5 w-3.5 text-primary-accent" /> Fresh Home Cooking
          </span>
          <h1 className="text-title-section mb-4">
            Our Dining Desk
          </h1>
          <div className="editorial-line mx-auto"></div>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed mt-4">
            Enjoy fresh, hot meals prepared directly in our family kitchen. Dine at our garden tables, request veranda service, or order room service to your cottage.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {currentBooking ? (
              <>
                <button
                  onClick={scrollToCart}
                  className="btn-luxury-primary flex items-center gap-2"
                >
                  View Reservation Cart <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="#menu-grid"
                  className="btn-luxury-outline"
                >
                  Browse Menu
                </Link>
              </>
            ) : (
              <Link
                href="/portal"
                className="btn-luxury-primary flex items-center gap-2"
              >
                Login to Order Room Service <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10" id="menu-grid">
        
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
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-primary text-primary-light shadow-sm'
                      : 'bg-muted-light text-muted hover:text-foreground hover:bg-border/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="input-luxury-container !py-2 sm:w-64 w-full">
              <div className="input-luxury-label">
                <Search className="h-3.5 w-3.5 text-primary-accent" /> Search Menu
              </div>
              <input 
                type="text" 
                placeholder="Momo, Thali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-luxury-field"
              />
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {isLoaded && filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group card-luxury flex flex-col"
              >
                {/* Photo */}
                <div className="relative h-52 w-full bg-muted-light overflow-hidden">
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
                  <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-nano font-bold uppercase tracking-wider text-primary border border-border/40 shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between gap-5 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-title-card group-hover:text-primary-accent transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-sm font-bold text-primary shrink-0">
                      NPR {item.price}
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  {currentBooking ? (
                    <div className="grid grid-cols-2 gap-3 mt-2 border-t border-border pt-4">
                      <button 
                        onClick={() => addToCart(item, 1)}
                        className="w-full bg-muted-light hover:bg-muted text-muted font-bold py-3 rounded-xl text-micro uppercase tracking-wider transition-colors flex items-center justify-center gap-1 border border-border/40"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add to cart
                      </button>
                      <button 
                        onClick={() => handleAddAndOrder(item)}
                        className="w-full bg-primary hover:bg-primary/95 text-primary-light font-bold py-3 rounded-xl text-micro uppercase tracking-wider transition-colors flex items-center justify-center"
                      >
                        Order Now
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 border-t border-border pt-4">
                       <Link
                         href="/portal"
                         className="block w-full text-center bg-muted-light hover:bg-border/50 text-muted font-bold py-3 rounded-xl text-micro uppercase tracking-wider transition-colors"
                       >
                         Login to Order
                       </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoaded && filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center text-sm text-muted flex flex-col items-center gap-4">
                <Utensils className="h-10 w-10 text-muted/30" />
                <p className="text-title-card text-lg">No dishes found</p>
                <p className="text-xs text-muted max-w-xs mx-auto">Try refining your search terms or selecting another dining category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Cart */}
        <div className="lg:col-span-4" ref={cartPanelRef}>
          {isLoaded && currentBooking ? (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 sticky top-24">
              {orderSuccess ? (
                /* Success screen */
                <div className="text-center py-10 flex flex-col items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <Check className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-title-card">Order Placed Successfully!</h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      We are preparing your food now for Room <strong>{targetRoom}</strong>. You can see its status on your guest screen.
                    </p>
                  </div>
                  <button 
                    onClick={handleResetSuccess}
                    className="btn-luxury-primary w-full mt-4"
                  >
                    Order More Food
                  </button>
                </div>
              ) : (
                /* Cart details */
                <>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary-accent" />
                      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Your Selection</h2>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="text-micro bg-primary text-primary-light px-3 py-1 rounded-full font-bold">
                        {cartItemCount} Items
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center gap-4">
                      <ShoppingBag className="h-12 w-12 text-muted/20" />
                      <p className="text-sm font-medium text-muted">Your order list is empty.</p>
                      <p className="text-xs text-muted/70 max-w-xs mx-auto">Add some fresh momos, Thali sets, or a warm cup of masala tea to start your order!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      
                      {/* Room delivery details */}
                      <div className="input-luxury-container !flex-row !items-center !gap-3 !py-1.5">
                        <span className="input-luxury-label shrink-0">Deliver to Room:</span>
                        <input 
                          type="text" 
                          value={targetRoom}
                          onChange={(e) => setCustomRoom(e.target.value)}
                          placeholder="Room #"
                          className="input-luxury-field !w-16 !text-center font-bold"
                        />
                      </div>

                      {/* Cart Items list */}
                      <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
                        {cart.map((item) => (
                          <div key={item.foodItemId} className="flex justify-between items-center gap-4 text-xs">
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="font-semibold text-foreground truncate">{item.name}</span>
                              <span className="text-micro text-muted font-bold mt-0.5">NPR {item.price}</span>
                            </div>
                            
                            {/* Quantity selection pill */}
                            <div className="flex items-center gap-2.5 bg-muted-light border border-border/50 px-2 py-1 rounded-xl shrink-0">
                              <button 
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity - 1)}
                                className="text-muted hover:text-foreground hover:bg-border/60 rounded p-0.5 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold font-mono text-mini text-foreground w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.foodItemId, item.quantity + 1)}
                                className="text-muted hover:text-foreground hover:bg-border/60 rounded p-0.5 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.foodItemId)}
                              className="text-muted hover:text-red-500 shrink-0 p-1.5 transition-colors"
                              title="Remove"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-border my-1"></div>

                      {/* Bill Details */}
                      <div className="flex flex-col gap-2.5 text-xs text-muted">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-bold text-foreground">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Veranda Delivery</span>
                          <span className="font-bold text-emerald-600">Free</span>
                        </div>
                        <div className="h-px bg-border/60 my-1"></div>
                        <div className="flex justify-between text-sm text-foreground font-bold">
                          <span>Total Cost</span>
                          <span className="text-primary font-bold text-base">NPR {cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Submit Order */}
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="btn-luxury-primary w-full mt-2"
                      >
                        Send Order to Kitchen <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Portal callout advertisement */
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 overflow-hidden sticky top-24">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div>
                <p className="text-subtitle-tag mb-2">Veranda Dining</p>
                <h3 className="text-title-card text-lg">
                  Dine in Your Cottage
                </h3>
                <div className="editorial-line"></div>
                <p className="text-xs sm:text-sm text-muted mt-4 leading-relaxed">
                  Staying in one of our cottages? Log in with your booking code to order hot food directly to your veranda.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs text-muted">
                {[
                  { icon: ChefHat, text: 'Home-cooked local meals' },
                  { icon: Clock3, text: 'Delivered hot to your cottage porch' },
                  { icon: UserCheck, text: 'Paid at check-out or via eSewa' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary-accent/10">
                      <feature.icon className="h-4.5 w-4.5 text-primary" />
                    </span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/portal" 
                className="btn-luxury-primary w-full mt-2 text-center"
              >
                Go to Portal to Order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
