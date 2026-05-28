'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { UtensilsCrossed, Clock, Check, Play, Printer, AlertCircle, ShoppingBag, X } from 'lucide-react';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus, isLoaded } = useApp();
  const [printTicket, setPrintTicket] = useState<Order | null>(null);

  // Filter orders to active (Placed, Preparing) and completed (Delivered)
  const activeOrders = orders
    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const completedOrders = orders
    .filter(o => o.status === 'Delivered')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // show last 10 completed

  const getMinutesAgo = (timeStr: string) => {
    const diffMs = Date.now() - new Date(timeStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins <= 0) return 'Just now';
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  };

  const handlePrint = (order: Order) => {
    setPrintTicket(order);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
      
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary border border-primary-accent/40">
            <UtensilsCrossed className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-muted mt-0.5">Live order queue for Motimahal Lodge restaurant room service.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-primary-light text-primary border border-primary-accent/30 px-4 py-2 rounded-2xl text-xs font-semibold">
            Active Tickets: {activeOrders.length}
          </div>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Active Tickets (Left Column, span 9) */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">Order Queue</h2>
          
          {isLoaded && activeOrders.length === 0 ? (
            <div className="flex-1 min-h-[300px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-card">
              <ShoppingBag className="h-10 w-10 text-muted/30 mb-3" />
              <h3 className="font-semibold text-foreground">All Orders Clear!</h3>
              <p className="text-xs text-muted max-w-xs mt-1">There are no pending food orders. When guests place orders from the portal, they will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoaded && activeOrders.map((order) => {
                const isPreparing = order.status === 'Preparing';
                
                return (
                  <div 
                    key={order.id} 
                    className={`bg-card border-2 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between transition-all ${
                      isPreparing ? 'border-amber-500/50' : 'border-primary/40'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className={`p-4 flex items-center justify-between text-white ${
                      isPreparing ? 'bg-amber-600' : 'bg-primary'
                    }`}>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/80 block leading-tight">Deliver to</span>
                        <span className="text-lg font-bold">Room {order.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/90">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{getMinutesAgo(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-muted uppercase font-semibold mb-3">
                          <span>Ref: {order.bookingRef}</span>
                          <span>Tkt: #{order.id.slice(-4).toUpperCase()}</span>
                        </div>

                        {/* Order Items list */}
                        <div className="flex flex-col gap-2.5">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm items-start border-b border-border/40 pb-1.5">
                              <span className="text-foreground">
                                <strong className="text-primary text-base font-bold mr-1.5">x{item.quantity}</strong> 
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ticket Footer / Action */}
                      <div className="mt-6 flex flex-col gap-2">
                        <div className="flex gap-2">
                          {/* Print Button */}
                          <button
                            onClick={() => handlePrint(order)}
                            className="p-2.5 bg-muted-light border border-border hover:bg-border/60 rounded-xl text-muted hover:text-foreground transition-all flex-1 flex justify-center items-center gap-1 text-xs font-semibold"
                            title="Simulate Thermal Printer print"
                          >
                            <Printer className="h-4 w-4" />
                            <span>Print</span>
                          </button>

                          {/* Progress/Deliver Button */}
                          {order.status === 'Placed' ? (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Preparing')}
                              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-[2]"
                            >
                              <Play className="h-4 w-4" />
                              <span>Prepare</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 flex-[2]"
                            >
                              <Check className="h-4 w-4" />
                              <span>Deliver</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Feed (Right Column, span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">Recently Completed</h2>
          
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-4 min-h-[300px]">
            {isLoaded && completedOrders.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-4 text-xs text-muted italic">
                No orders completed yet in this session.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {isLoaded && completedOrders.map((order) => (
                  <div key={order.id} className="border border-border/80 p-3 rounded-2xl flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center font-semibold text-muted">
                      <span>Room {order.roomNumber}</span>
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> Delivered
                      </span>
                    </div>
                    
                    {/* Compact Items list */}
                    <div className="flex flex-col mt-1 text-muted text-[11px]">
                      {order.items.map((item, index) => (
                        <div key={index} className="truncate">
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

      </div>

      {/* Simulated Thermal Ticket Printer dialog */}
      {printTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-xs rounded-lg shadow-2xl p-6 border border-zinc-200 font-mono text-sm leading-relaxed animate-fade-in relative flex flex-col gap-4">
            
            {/* Cut Line */}
            <div className="border-b-2 border-dashed border-zinc-300 pb-2 flex justify-between items-center text-[10px] text-zinc-400">
              <span>* MOTIMAHAL KITCHEN PRINTER *</span>
              <button 
                onClick={() => setPrintTicket(null)}
                className="text-zinc-600 hover:text-black font-sans font-bold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Ticket Header details */}
            <div className="text-center flex flex-col gap-1 border-b border-zinc-200 pb-4">
              <h3 className="font-bold text-base">MOTIMAHAL LODGE</h3>
              <p className="text-[11px] text-zinc-500">Sauraha, Chitwan, Nepal</p>
              <p className="text-[11px] text-zinc-500">Date: {new Date(printTicket.createdAt).toLocaleString()}</p>
              <p className="text-[11px] text-zinc-500">Tkt: #{printTicket.id.slice(-4).toUpperCase()}</p>
            </div>

            {/* Huge Room Identifier */}
            <div className="text-center border-b border-zinc-200 py-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block font-sans">Deliver Location</span>
              <h2 className="text-3xl font-extrabold font-mono tracking-tight mt-1 text-zinc-900">ROOM {printTicket.roomNumber}</h2>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-1.5 border-b border-zinc-200 py-4">
              {printTicket.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-xs">
                  <span>{item.name}</span>
                  <span className="font-bold text-right ml-4 shrink-0">QTY: {item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Info footer */}
            <div className="text-center text-[10px] text-zinc-500 flex flex-col gap-1 pt-2">
              <span>Booking Ref: {printTicket.bookingRef}</span>
              <span className="mt-1 font-bold">* STITCHED KITCHEN COPY *</span>
            </div>

            {/* Sim print action */}
            <button 
              onClick={() => {
                alert(`Ticket sent to kitchen printer queue for Room ${printTicket.roomNumber}!`);
                setPrintTicket(null);
              }}
              className="bg-zinc-800 hover:bg-black text-white font-sans text-xs py-2 rounded-md font-medium transition-all"
            >
              Confirm Print Ticket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
