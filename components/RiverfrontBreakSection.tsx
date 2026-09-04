import React from 'react';

export default function RiverfrontBreakSection() {
  return (
    <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900 border-y border-brand-border">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/gallery/narayani-river-break.jpg')",
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/35" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
        <span className="text-white/95 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] block">
          NARAYANI RIVERFRONT PROMENADE
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-sm leading-tight">
          Where the river meets the quiet wilderness of Chitwan.
        </h2>
      </div>
    </section>
  );
}
