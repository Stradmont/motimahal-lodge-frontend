'use client';

import React, { useState } from 'react';
import { UtensilsCrossed, Clock, Check, Play, Printer, ShoppingBag, X } from 'lucide-react';
import { Order } from '@/types';

interface KitchenViewProps {
  orders: Order[];
  updateOrderStatus: (id: string, status: any) => void;
  activeTab: 'queue' | 'completed';
  setActiveTab: (tab: 'queue' | 'completed') => void;
}

export default function KitchenView({
  orders,
  updateOrderStatus,
  activeTab,
  setActiveTab
}: KitchenViewProps) {
  
  const [printTicket, setPrintTicket] = useState<Order | null>(null);

  const activeOrders = orders
    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completedOrders = orders
    .filter(o => o.status === 'Delivered')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const getMinutesAgo = (timeStr: string) => {
    const diffMs = Date.now() - new Date(timeStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins <= 0) return 'Just now';
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* KDS Header quick summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Meals Cooking Now</span>
          </div>
          <span className="text-sm font-bold text-primary-accent bg-primary-accent/10 px-3 py-1 rounded-full border border-primary-accent/20">{activeOrders.length} Orders</span>
        </div>
        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Recently Served</span>
          </div>
          <span className="text-sm font-bold text-primary bg-primary-light px-3 py-1 rounded-full border border-primary/20">{completedOrders.length} Served</span>
        </div>
      </div>

      {/* Tabs selector on mobile screen */}
      <div className="md:hidden flex gap-1 bg-muted-light p-1 rounded-xl border border-border">
        <button 
          onClick={() => setActiveTab('queue')}
          className={`flex-1 text-center py-2 rounded-lg text-micro font-bold uppercase transition-all ${activeTab === 'queue' ? 'bg-primary text-primary-light' : 'text-muted'}`}
        >
          Cooking ({activeOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`flex-1 text-center py-2 rounded-lg text-micro font-bold uppercase transition-all ${activeTab === 'completed' ? 'bg-primary text-primary-light' : 'text-muted'}`}
        >
          Served ({completedOrders.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* active tickets */}
        {(activeTab === 'queue' || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <div className="lg:col-span-9 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted hidden lg:block">Kitchen Orders</h3>
            
            {activeOrders.length === 0 ? (
              <div className="min-h-[300px] border border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-card">
                <ShoppingBag className="h-8 w-8 text-muted/30 mb-2 animate-bounce" />
                <h4 className="font-semibold text-foreground">Kitchen is Clean & Clear!</h4>
                <p className="text-xs text-muted max-w-xs mt-1">When guests order food from their cottages, their orders will show up here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOrders.map((order) => {
                  const isPreparing = order.status === 'Preparing';
                  return (
                    <div key={order.id} className={`bg-card border-2 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between transition-all ${isPreparing ? 'border-primary-accent/40' : 'border-primary/30'}`}>
                      <div className={`p-4 flex items-center justify-between text-white ${isPreparing ? 'bg-primary-accent' : 'bg-primary'}`}>
                        <div>
                          <span className="text-micro uppercase font-bold text-white/80 block leading-tight">Cottage Room</span>
                          <span className="text-lg font-bold font-mono">Room {order.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/90">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{getMinutesAgo(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                        <div>
                          <div className="flex justify-between items-center text-micro text-muted uppercase font-bold mb-3 border-b border-border/40 pb-2">
                            <span>Code: {order.bookingRef}</span>
                            <span>Order #{order.id.slice(-4).toUpperCase()}</span>
                          </div>

                          <div className="flex flex-col gap-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-xs items-start border-b border-border/30 pb-1">
                                <span className="text-foreground">
                                  <strong className="text-primary-accent text-sm font-bold mr-1.5">x{item.quantity}</strong> {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setPrintTicket(order)} className="p-2 bg-primary-light border border-primary/20 hover:bg-border/60 rounded-xl text-primary text-xs font-bold flex-1 flex items-center justify-center gap-1">
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print</span>
                          </button>
                          {order.status === 'Placed' ? (
                            <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="px-3 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 flex-[2] font-sans">
                              <Play className="h-3.5 w-3.5" />
                              <span>Start Cooking</span>
                            </button>
                          ) : (
                            <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="px-3 py-2 bg-primary hover:bg-primary/95 text-primary-light rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 flex-[2] font-sans">
                              <Check className="h-3.5 w-3.5" />
                              <span>Send to Veranda</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* completed feed */}
        {(activeTab === 'completed' || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted hidden lg:block">Served Meals</h3>
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm flex flex-col gap-4 min-h-[300px]">
              {completedOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4 text-xs text-muted font-medium">No meals served yet.</div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="border border-border/80 p-3.5 rounded-2xl flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-center font-bold text-foreground">
                        <span>Room {order.roomNumber}</span>
                        <span className="text-micro text-primary flex items-center gap-0.5 uppercase tracking-wider font-bold">
                          <Check className="h-3 w-3" /> Served
                        </span>
                      </div>
                      <div className="flex flex-col mt-1 text-muted text-micro font-medium leading-relaxed">
                        {order.items.map((item, index) => (
                          <div key={index} className="border-b border-border/30 pb-0.5 mb-0.5 last:border-0 last:pb-0 last:mb-0">
                            x{item.quantity} {item.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Simulated Thermal printer dialog */}
      {printTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 w-full max-w-xs rounded-xl shadow-2xl p-6 border border-zinc-200 font-mono text-xs leading-relaxed relative flex flex-col gap-4">
            <div className="border-b border-dashed border-zinc-300 pb-2 flex justify-between items-center text-[10px] text-zinc-400">
              <span>* KITCHEN TICKET COPY *</span>
              <button onClick={() => setPrintTicket(null)} className="text-zinc-400 hover:text-zinc-900 font-sans font-bold"><X className="h-4 w-4" /></button>
            </div>
            <div className="text-center flex flex-col gap-1 border-b border-zinc-200 pb-4">
              <h3 className="font-bold text-sm">MOTIMAHAL FAMILY KITCHEN</h3>
              <p className="text-[10px] text-zinc-500">{new Date(printTicket.createdAt).toLocaleString()}</p>
              <p className="text-[10px] text-zinc-500">Order #{printTicket.id.slice(-4).toUpperCase()}</p>
            </div>
            <div className="text-center border-b border-zinc-200 py-3">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Deliver Destination</span>
              <h2 className="text-2xl font-black tracking-tight mt-1 text-zinc-900">ROOM {printTicket.roomNumber}</h2>
            </div>
            <div className="flex flex-col gap-2 border-b border-zinc-200 py-4">
              {printTicket.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span>{item.name}</span>
                  <span className="font-bold text-right ml-4 shrink-0">QTY: {item.quantity}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                alert(`Simulated thermal ticket sent to kitchen printer for Room ${printTicket.roomNumber}!`);
                setPrintTicket(null);
              }}
              className="bg-zinc-800 hover:bg-zinc-900 text-white font-sans text-xs py-2.5 rounded-lg font-bold transition-all"
            >
              Print Order Slip
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
