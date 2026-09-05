import { apiClient, ApiResponse } from '@/lib/api-client';
import { RoomInquiry } from '@/lib/types/inquiry';

export const InquiryService = {
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<RoomInquiry[]>> {
    return apiClient.get<RoomInquiry[]>('/api/v1/admin/inquiries', params);
  },

  async getById(id: string): Promise<ApiResponse<RoomInquiry | null>> {
    return apiClient.get<RoomInquiry>(`/api/v1/admin/inquiries/${id}`);
  },

  async create(input: Partial<RoomInquiry>): Promise<ApiResponse<RoomInquiry>> {
    return apiClient.post<RoomInquiry>('/api/v1/public/inquiries', input);
  },

  async update(id: string, input: Partial<RoomInquiry>): Promise<ApiResponse<RoomInquiry>> {
    return apiClient.put<RoomInquiry>(`/api/v1/admin/inquiries/${id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/inquiries/${id}`);
  },
};
