import React from 'react';
import { Room } from '@/lib/data';
import {
  Check,
  ShowerHead,
  Wifi,
  ThermometerSun,
  Tv,
  Coffee,
  Car,
  Sun,
  Flame,
  Sparkles,
  GlassWater,
  CheckCircle2,
  Trees,
} from 'lucide-react';

interface RoomAmenitiesSectionProps {
  room: Room;
}

// Icon helper function for room amenities
function renderAmenityIcon(amenityName: string) {
  const lower = amenityName.toLowerCase();
  if (lower.includes('air') || lower.includes('ac')) return <ThermometerSun className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return <Wifi className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('bath') || lower.includes('ensuite')) return <ShowerHead className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('hot') || lower.includes('shower')) return <Flame className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('tv') || lower.includes('led')) return <Tv className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('breakfast') || lower.includes('coffee') || lower.includes('tea')) return <Coffee className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('balcony') || lower.includes('patio') || lower.includes('sun')) return <Sun className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('parking') || lower.includes('car')) return <Car className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('water') || lower.includes('bottle')) return <GlassWater className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('housekeeping') || lower.includes('clean')) return <Sparkles className="h-6 w-6 text-[#1F3A2B]" />;
  if (lower.includes('garden') || lower.includes('lawn')) return <Trees className="h-6 w-6 text-[#1F3A2B]" />;

  return <Check className="h-6 w-6 text-[#1F3A2B]" />;
}

export default function RoomAmenitiesSection({ room }: RoomAmenitiesSectionProps) {
  return (
    <div className="space-y-10">
      {/* Detailed Description */}
      <div
        className="p-7 sm:p-10 rounded-xl border border-[#E6DFD5] space-y-5 shadow-2xs text-[#2D2B2A]"
        style={{
          backgroundImage: "url('/backs-2.png')",
          backgroundRepeat: 'repeat',
        }}
      >
        <h2 className="font-heading text-3xl font-bold text-[#2D2B2A]">
          About this room
        </h2>

        <div className="space-y-4 text-stone-800 text-lg leading-relaxed font-normal">
          {room.fullDescription ? (
            room.fullDescription.map((para, pIdx) => <p key={pIdx}>{para}</p>)
          ) : (
            <p>{room.description}</p>
          )}
        </div>

        {/* Highlights List */}
        {room.features && room.features.length > 0 && (
          <div className="pt-5 border-t border-[#E6DFD5] space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#2D2B2A]">
              Room highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2.5 text-base text-stone-800">
                  <CheckCircle2 className="h-5 w-5 text-[#1F3A2B] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Icon Amenities Grid */}
      <div
        className="p-7 sm:p-10 rounded-xl border border-[#E6DFD5] space-y-5 shadow-2xs text-[#2D2B2A]"
        style={{
          backgroundImage: "url('/backs-2.png')",
          backgroundRepeat: 'repeat',
        }}
      >
        <h2 className="font-heading text-3xl font-bold text-[#2D2B2A]">
          Included room amenities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {room.amenities.map((amenity, aIdx) => (
            <div
              key={aIdx}
              className="bg-white/80 backdrop-blur-xs p-4 rounded-lg border border-[#E6DFD5] flex items-center gap-3.5 shadow-2xs"
            >
              <div className="w-10 h-10 bg-white rounded-md border border-[#E6DFD5] flex items-center justify-center shrink-0">
                {renderAmenityIcon(amenity)}
              </div>
              <span className="text-base font-semibold text-stone-800">
                {amenity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
