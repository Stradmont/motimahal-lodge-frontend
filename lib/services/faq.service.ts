import { apiClient, ApiResponse } from '@/lib/api-client';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  orderIndex?: number;
}

export const FaqService = {
  async getAll(params?: any): Promise<ApiResponse<FaqItem[]>> {
    return apiClient.get<FaqItem[]>('/api/v1/faqs', params);
  },
  async getById(id: string): Promise<ApiResponse<FaqItem | null>> {
    return apiClient.get<FaqItem>(`/api/v1/faqs/${id}`);
  },
  async create(data: Partial<FaqItem>): Promise<ApiResponse<FaqItem>> {
    return apiClient.post<FaqItem>('/api/v1/faqs', data);
  },
  async update(id: string, data: Partial<FaqItem>): Promise<ApiResponse<FaqItem>> {
    return apiClient.put<FaqItem>(`/api/v1/faqs/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/faqs/${id}`);
  },
};
