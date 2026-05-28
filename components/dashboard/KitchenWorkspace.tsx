'use client';

import React, { useState } from 'react';
import { UtensilsCrossed, Clock, Check, Play, Printer, ShoppingBag, X } from 'lucide-react';
import { Order } from '../../types';

interface KitchenWorkspaceProps {
  orders: Order[];
  updateOrderStatus: (id: string, status: any) => void;
  activeTab: 'queue' | 'completed';
  setActiveTab: (tab: 'queue' | 'completed') => void;
}

export default function KitchenWorkspace({
  orders,
  updateOrderStatus,
  activeTab,
  setActiveTab
}: KitchenWorkspaceProps) {
  
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
        <div className="bg-card border border-border p-4 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase text-muted">Active Kitchen Queue</span>
          </div>
          <span className="text-xl font-bold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">{activeOrders.length} Tickets</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase text-muted">Served (Recent)</span>
          </div>
          <span className="text-xl font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">{completedOrders.length} Served</span>
        </div>
      </div>

      {/* Tabs selector on mobile screen */}
      <div className="md:hidden flex gap-1 bg-muted-light p-1 rounded-xl border border-border">
        <button 
          onClick={() => setActiveTab('queue')}
          className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === 'queue' ? 'bg-primary text-primary-light' : 'text-muted'}`}
        >
          Tickets Queue ({activeOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === 'completed' ? 'bg-primary text-primary-light' : 'text-muted'}`}
        >
          Served ({completedOrders.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* active tickets */}
        {(activeTab === 'queue' || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <div className="lg:col-span-9 flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted hidden lg:block">Order Queue</h3>
            
            {activeOrders.length === 0 ? (
              <div className="min-h-[300px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-card">
                <ShoppingBag className="h-9 w-9 text-muted/30 mb-2 animate-bounce" />
                <h4 className="font-semibold text-foreground">Kitchen is Clear!</h4>
                <p className="text-xs text-muted max-w-xs mt-1">Pending guest orders placed from their room portals will print in KDS live queue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOrders.map((order) => {
                  const isPreparing = order.status === 'Preparing';
                  return (
                    <div key={order.id} className={`bg-card border-2 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between transition-all ${isPreparing ? 'border-amber-500/50' : 'border-primary/40'}`}>
                      <div className={`p-4 flex items-center justify-between text-white ${isPreparing ? 'bg-amber-600' : 'bg-primary'}`}>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-white/80 block leading-tight">Deliver to</span>
                          <span className="text-lg font-bold font-mono">Room {order.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/90">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{getMinutesAgo(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                        <div>
                          <div className="flex justify-between items-center text-[10px] text-muted uppercase font-semibold mb-3">
                            <span>Ref: {order.bookingRef}</span>
                            <span>Tkt: #{order.id.slice(-4).toUpperCase()}</span>
                          </div>

                          <div className="flex flex-col gap-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm items-start border-b border-border/30 pb-1">
                                <span className="text-foreground">
                                  <strong className="text-primary text-base font-bold mr-1.5">x{item.quantity}</strong> {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setPrintTicket(order)} className="p-2 bg-muted-light border border-border hover:bg-border/60 rounded-xl text-muted hover:text-foreground text-xs font-semibold flex-1 flex items-center justify-center gap-1">
                            <Printer className="h-4 w-4" />
                            <span>Print</span>
                          </button>
                          {order.status === 'Placed' ? (
                            <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-[2] font-sans">
                              <Play className="h-4 w-4" />
                              <span>Prepare</span>
                            </button>
                          ) : (
                            <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-[2] font-sans">
                              <Check className="h-4 w-4" />
                              <span>Deliver</span>
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted hidden lg:block">Completed Tickets</h3>
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-4 min-h-[300px]">
              {completedOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4 text-xs text-muted italic">No tickets served yet.</div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="border border-border p-3 rounded-2xl flex flex-col gap-1 text-xs">
                      <div className="flex justify-between items-center font-semibold text-muted">
                        <span className="text-foreground">Room {order.roomNumber}</span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Served
                        </span>
                      </div>
                      <div className="flex flex-col mt-1 text-muted text-[11px] leading-relaxed">
                        {order.items.map((item, index) => (
                          <div key={index}>x{item.quantity} {item.name}</div>
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
          <div className="bg-white text-black w-full max-w-xs rounded-lg shadow-2xl p-6 border border-zinc-200 font-mono text-sm leading-relaxed relative flex flex-col gap-4">
            <div className="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-center text-[10px] text-zinc-400">
              <span>* MOTIMAHAL KITCHEN COPY *</span>
              <button onClick={() => setPrintTicket(null)} className="text-zinc-600 hover:text-black font-sans font-bold"><X className="h-4 w-4" /></button>
            </div>
            <div className="text-center flex flex-col gap-1 border-b border-zinc-200 pb-4">
              <h3 className="font-bold text-base">MOTIMAHAL LODGE KITCHEN</h3>
              <p className="text-[11px] text-zinc-500">{new Date(printTicket.createdAt).toLocaleString()}</p>
              <p className="text-[11px] text-zinc-500">Tkt: #{printTicket.id.slice(-4).toUpperCase()}</p>
            </div>
            <div className="text-center border-b border-zinc-200 py-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block">Deliver Destination</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900">ROOM {printTicket.roomNumber}</h2>
            </div>
            <div className="flex flex-col gap-1.5 border-b border-zinc-200 py-4">
              {printTicket.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-xs">
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
              className="bg-zinc-800 hover:bg-black text-white font-sans text-xs py-2 rounded-md font-medium transition-all"
            >
              Confirm Print Queue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
