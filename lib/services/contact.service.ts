import { apiClient, ApiResponse } from '@/lib/api-client';
import { GeneralContactInquiry, GeneralContactStatus } from '@/lib/types/inquiry';

export const ContactService = {
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<GeneralContactInquiry[]>> {
    return apiClient.get<GeneralContactInquiry[]>('/api/v1/contact-us', params);
  },

  async getById(id: string): Promise<ApiResponse<GeneralContactInquiry | null>> {
    return apiClient.get<GeneralContactInquiry>(`/api/v1/contact-us/${id}`);
  },

  async submit(input: Partial<GeneralContactInquiry>): Promise<ApiResponse<GeneralContactInquiry>> {
    return apiClient.post<GeneralContactInquiry>('/api/v1/contact-us', input);
  },

  async updateStatus(id: string, status: GeneralContactStatus): Promise<ApiResponse<GeneralContactInquiry>> {
    return apiClient.put<GeneralContactInquiry>(`/api/v1/contact-us/${id}/status`, { status });
  },

  async update(id: string, input: Partial<GeneralContactInquiry>): Promise<ApiResponse<GeneralContactInquiry>> {
    return apiClient.put<GeneralContactInquiry>(`/api/v1/contact-us/${id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/contact-us/${id}`);
  },
};
