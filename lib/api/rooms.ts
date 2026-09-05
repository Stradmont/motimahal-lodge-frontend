import { RoomItem, CreateRoomInput, RoomCategory, RoomStatus } from '../types/room';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500';
const STORAGE_KEY = 'motimahal_admin_rooms_v1';

export const mockInitialRooms: RoomItem[] = [
  {
    id: 'RM-101',
    name: 'River View Deluxe Suite',
    slug: 'river-view-deluxe-suite',
    type: RoomCategory.SUITE,
    pricePerNight: 8500,
    capacity: 2,
    totalUnits: 3,
    bedType: 'King Size Bed',
    sizeSqFt: 450,
    status: RoomStatus.AVAILABLE,
    description:
      '<p>Experience breathtaking views of the <strong>Narayani River</strong> from your private balcony. Features luxury plush linens, handcrafted teak furniture, and modern ensuite bathroom with hot rainfall shower.</p><ul><li>Panoranamic river balcony</li><li>Complimentary organic breakfast</li><li>High-speed fiber Wi-Fi</li></ul>',
    shortDescription: 'Luxury suite featuring panoramic Narayani River view private balcony and plush king bedding.',
    amenities: ['River Balcony', 'AC', 'Free WiFi', 'Breakfast Included', 'Hot Shower', 'Mini Bar'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RM-102',
    name: 'Heritage Garden Double Room',
    slug: 'heritage-garden-double-room',
    type: RoomCategory.DELUXE,
    pricePerNight: 5500,
    capacity: 2,
    totalUnits: 5,
    bedType: 'Queen Size Bed',
    sizeSqFt: 320,
    status: RoomStatus.OCCUPIED,
    description:
      '<p>Surrounded by lush Chitwan flora, this double room combines authentic Nepali architecture with modern amenities. Perfect for couples seeking peace and warmth.</p>',
    shortDescription: 'Peaceful garden view double room with traditional Nepali timber craft and modern comfort.',
    amenities: ['Garden View', 'AC', 'Free WiFi', 'Flat TV', 'Hot Shower'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RM-103',
    name: 'Executive Family Cottage',
    slug: 'executive-family-cottage',
    type: RoomCategory.FAMILY,
    pricePerNight: 12000,
    capacity: 5,
    totalUnits: 2,
    bedType: '1 King + 2 Twin Beds',
    sizeSqFt: 650,
    status: RoomStatus.AVAILABLE,
    description:
      '<h3>Spacious Family Haven</h3><p>Designed for multi-generational families or group retreats. Includes 2 separate bedrooms, cozy living room lounge, and private outdoor patio overlooking the garden.</p>',
    shortDescription: '2-bedroom standalone family cottage with living lounge and outdoor private patio.',
    amenities: ['2 Bedrooms', 'Living Room', 'Patio', 'AC', 'Free WiFi', 'Breakfast Included'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'RM-104',
    name: 'Standard Cozy Twin Room',
    slug: 'standard-cozy-twin-room',
    type: RoomCategory.STANDARD,
    pricePerNight: 3800,
    capacity: 2,
    totalUnits: 4,
    bedType: '2 Twin Single Beds',
    sizeSqFt: 260,
    status: RoomStatus.MAINTENANCE,
    description:
      '<p>Efficient, pristine accommodation for budget travelers and wildlife safari enthusiasts. Features twin single beds, modern private bath, and high-speed Wi-Fi.</p>',
    shortDescription: 'Clean and comfortable twin single bed room perfect for travelers and safari guests.',
    amenities: ['Twin Beds', 'Free WiFi', 'Hot Shower', 'Desk'],
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
];

function getStoredRooms(): RoomItem[] {
  if (typeof window === 'undefined') return mockInitialRooms;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to read rooms from localStorage:', err);
  }
  return mockInitialRooms;
}

function saveStoredRooms(rooms: RoomItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch (err) {
    console.error('Failed to save rooms to localStorage:', err);
  }
}

export async function fetchRooms(type?: string, search?: string): Promise<RoomItem[]> {
  try {
    const query = new URLSearchParams();
    if (type && type !== 'All') query.append('type', type);
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE_URL}/api/v1/rooms?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.success && Array.isArray(result.data)) {
        saveStoredRooms(result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend API connection unavailable, fallback to local storage', error);
  }

  // Fallback to local storage
  let rooms = getStoredRooms();
  if (type && type !== 'All') {
    rooms = rooms.filter((r) => r.type === type);
  }
  if (search) {
    const q = search.toLowerCase();
    rooms = rooms.filter((r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }
  return rooms;
}

export async function createRoomApi(input: CreateRoomInput): Promise<RoomItem> {
  let backendSuccess = false;
  let backendRoom: RoomItem | null = null;
  let backendErrorMessage = '';

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      backendSuccess = true;
      backendRoom = result.data;
    } else {
      backendErrorMessage = result.message || 'Server rejected room creation request';
    }
  } catch (err) {
    // API server unreachable - using local persistence fallback
  }

  if (backendSuccess && backendRoom) {
    const current = getStoredRooms();
    saveStoredRooms([backendRoom, ...current]);
    return backendRoom;
  }

  if (backendErrorMessage) {
    throw new Error(backendErrorMessage);
  }

  // Local fallback creation
  const current = getStoredRooms();
  const slug = input.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const newRoom: RoomItem = {
    id: `RM-${Math.floor(100 + Math.random() * 900)}`,
    ...input,
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newRoom, ...current];
  saveStoredRooms(updated);
  return newRoom;
}

export async function updateRoomApi(id: string, input: Partial<CreateRoomInput>): Promise<RoomItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      const current = getStoredRooms();
      const updated = current.map((r) => (r.id === id ? { ...r, ...result.data } : r));
      saveStoredRooms(updated);
      return result.data;
    }
  } catch (err) {
    console.warn('Backend API connection unavailable, fallback to local update', err);
  }

  const current = getStoredRooms();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Room not found in inventory');

  const updatedRoom: RoomItem = {
    ...current[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  current[index] = updatedRoom;
  saveStoredRooms([...current]);
  return updatedRoom;
}

export async function updateRoomStatusApi(id: string, status: RoomStatus): Promise<RoomItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      const current = getStoredRooms();
      const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
      saveStoredRooms(updated);
      return result.data;
    }
  } catch (err) {
    console.warn('Backend API connection unavailable, fallback to local status update', err);
  }

  const current = getStoredRooms();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Room not found');

  current[index].status = status;
  current[index].updatedAt = new Date().toISOString();
  saveStoredRooms([...current]);
  return current[index];
}

export async function deleteRoomApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const current = getStoredRooms();
      saveStoredRooms(current.filter((r) => r.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Backend API connection unavailable, fallback to local delete', err);
  }

  const current = getStoredRooms();
  saveStoredRooms(current.filter((r) => r.id !== id));
  return true;
}
