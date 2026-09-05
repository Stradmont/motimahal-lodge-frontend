import { apiClient, ApiResponse } from '@/lib/api-client';
import { RoomItem, CreateRoomInput, RoomStatus } from '@/lib/types/room';

export const RoomService = {
  async getAll(params?: { type?: string; status?: string; search?: string }): Promise<ApiResponse<RoomItem[]>> {
    return apiClient.get<RoomItem[]>('/api/v1/rooms', params);
  },

  async getById(id: string): Promise<ApiResponse<RoomItem | null>> {
    return apiClient.get<RoomItem>(`/api/v1/rooms/${id}`);
  },

  async create(input: CreateRoomInput): Promise<ApiResponse<RoomItem>> {
    return apiClient.post<RoomItem>('/api/v1/rooms', input);
  },

  async update(id: string, input: Partial<CreateRoomInput>): Promise<ApiResponse<RoomItem>> {
    return apiClient.put<RoomItem>(`/api/v1/rooms/${id}`, input);
  },

  async updateStatus(id: string, status: RoomStatus): Promise<ApiResponse<RoomItem>> {
    return apiClient.patch<RoomItem>(`/api/v1/rooms/${id}/status`, { status });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/rooms/${id}`);
  },
};
