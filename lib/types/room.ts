export enum RoomCategory {
  DELUXE = 'Deluxe',
  SUITE = 'Suite',
  FAMILY = 'Family',
  STANDARD = 'Standard',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export interface RoomItem {
  id: string;
  name: string;
  slug: string;
  type: RoomCategory;
  pricePerNight: number;
  capacity: number;
  totalUnits: number;
  bedType?: string;
  sizeSqFt?: number;
  status: RoomStatus;
  description: string;
  shortDescription?: string;
  amenities: string[];
  imageUrl: string;
  galleryImages: string[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomInput {
  name: string;
  type: RoomCategory;
  pricePerNight: number;
  capacity: number;
  totalUnits: number;
  bedType?: string;
  sizeSqFt?: number;
  status: RoomStatus;
  description: string;
  shortDescription?: string;
  amenities: string[];
  imageUrl: string;
  galleryImages: string[];
  isFeatured?: boolean;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  id: string;
}
