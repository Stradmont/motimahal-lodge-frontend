import { apiClient, ApiResponse } from '@/lib/api-client';
import { RoomItem, CreateRoomInput, RoomStatus } from '@/lib/types/room';

// ─── Admin API (requires authentication) ─────────────────────────────────────

export const AdminRoomService = {
  async getAll(params?: { type?: string; status?: string; search?: string }): Promise<ApiResponse<RoomItem[]>> {
    const cleanParams: Record<string, string> = {};
    if (params?.type && params.type !== 'All') cleanParams.type = params.type;
    if (params?.status && params.status !== 'All') cleanParams.status = params.status;
    if (params?.search) cleanParams.search = params.search;
    return apiClient.get<RoomItem[]>('/api/v1/admin/rooms', Object.keys(cleanParams).length ? cleanParams : undefined);
  },

  async getById(id: string): Promise<ApiResponse<RoomItem | null>> {
    return apiClient.get<RoomItem>(`/api/v1/admin/rooms/${id}`);
  },

  async create(input: CreateRoomInput): Promise<ApiResponse<RoomItem>> {
    return apiClient.post<RoomItem>('/api/v1/admin/rooms', input);
  },

  async update(id: string, input: Partial<CreateRoomInput>): Promise<ApiResponse<RoomItem>> {
    return apiClient.put<RoomItem>(`/api/v1/admin/rooms/${id}`, input);
  },

  async updateStatus(id: string, status: RoomStatus): Promise<ApiResponse<RoomItem>> {
    return apiClient.patch<RoomItem>(`/api/v1/admin/rooms/${id}/status`, { status });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/rooms/${id}`);
  },
};

// ─── Public API (no authentication required) ──────────────────────────────────

export const PublicRoomService = {
  async getAll(params?: { type?: string }): Promise<ApiResponse<RoomItem[]>> {
    const cleanParams: Record<string, string> = {};
    if (params?.type && params.type !== 'All') cleanParams.type = params.type;
    return apiClient.get<RoomItem[]>('/api/v1/public/rooms', Object.keys(cleanParams).length ? cleanParams : undefined);
  },

  async getBySlug(slug: string): Promise<ApiResponse<RoomItem | null>> {
    return apiClient.get<RoomItem>(`/api/v1/public/rooms/${slug}`);
  },
};

// ─── Backward-compatible alias (Admin) ───────────────────────────────────────
export const RoomService = AdminRoomService;
