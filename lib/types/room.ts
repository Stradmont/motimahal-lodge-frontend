/** Resolved Media object returned by API (enriched from MediaEntity) */
export interface ResolvedMedia {
  id: string;
  url: string;
  name: string;
  mimeType: string;
}

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
  availableUnits?: number;
  bedType?: string;
  sizeSqFt?: number;
  status: RoomStatus;
  description: string;
  shortDescription?: string;
  amenities: string[];
  /** Media ID stored in entity */
  imageId?: string;
  /** Enriched from MediaEntity by the API */
  image?: ResolvedMedia | null;
  /** Media IDs stored in entity */
  galleryImageIds?: string[];
  /** Enriched from MediaEntity[] by the API */
  galleryImages?: ResolvedMedia[];
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
  /** Media ID to send on create/update */
  imageId?: string;
  /** Media IDs to send on create/update */
  galleryImageIds?: string[];
  isFeatured?: boolean;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  id: string;
}
