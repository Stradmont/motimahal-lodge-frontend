import { apiClient } from '@/lib/api-client';
import { RoomItem, CreateRoomInput } from '../types/room';

// ─── Admin API (requires authentication) ─────────────────────────────────────

/** Admin: fetch all rooms with search/filter/pagination */
export async function fetchAdminRooms(params?: {
  type?: string;
  status?: string;
  search?: string;
}): Promise<RoomItem[]> {
  const queryParams: Record<string, string> = {};
  if (params?.type && params.type !== 'All' && params.type !== 'ALL') {
    queryParams.type = params.type;
  }
  if (params?.status && params.status !== 'all' && params.status !== 'ALL') {
    queryParams.status = params.status;
  }
  if (params?.search) {
    queryParams.search = params.search;
  }

  const res = await apiClient.get<RoomItem[]>('/api/v1/admin/rooms', queryParams);
  if (!res.success) {
    throw new Error(res.message || 'Failed to fetch rooms');
  }
  return res.data || [];
}

/** Admin: create a new room */
export async function createRoom(data: CreateRoomInput): Promise<RoomItem> {
  const res = await apiClient.post<RoomItem>('/api/v1/admin/rooms', data);
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to create room');
  }
  return res.data;
}

/** Admin: update a room by ID */
export async function updateRoom(id: string, data: Partial<CreateRoomInput>): Promise<RoomItem> {
  const res = await apiClient.put<RoomItem>(`/api/v1/admin/rooms/${id}`, data);
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to update room');
  }
  return res.data;
}

/** Admin: delete a room by ID */
export async function deleteRoom(id: string): Promise<boolean> {
  const res = await apiClient.delete<boolean>(`/api/v1/admin/rooms/${id}`);
  if (!res.success) {
    throw new Error(res.message || 'Failed to delete room');
  }
  return true;
}

// ─── Public API (no authentication required) ──────────────────────────────────

/** Public: fetch all publicly available rooms */
export async function fetchRooms(params?: { type?: string }): Promise<RoomItem[]> {
  const queryParams: Record<string, string> = {};
  if (params?.type && params.type !== 'All' && params.type !== 'ALL') {
    queryParams.type = params.type;
  }

  const res = await apiClient.get<RoomItem[]>('/api/v1/public/rooms', queryParams);
  if (!res.success) {
    throw new Error(res.message || 'Failed to fetch rooms');
  }
  return res.data || [];
}

/** Public: fetch a single room by its slug */
export async function fetchRoomBySlug(slug: string): Promise<RoomItem | null> {
  try {
    const res = await apiClient.get<RoomItem>(`/api/v1/public/rooms/${slug}`);
    if (!res.success || !res.data) {
      return null;
    }
    return res.data;
  } catch {
    return null;
  }
}
