import React from 'react';
import { Room } from '@/lib/data';

interface RoomDetailHeroProps {
  room: Room;
}

export default function RoomDetailHero({ room }: RoomDetailHeroProps) {
  return (
    <section className="relative w-full h-[48vh] min-h-[360px] flex items-center justify-center overflow-hidden bg-stone-900">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${room.image}')`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/55 backdrop-blur-xs" />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center text-white space-y-3">
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white drop-shadow-md leading-tight">
          {room.name}
        </h1>
      </div>
    </section>
  );
}
