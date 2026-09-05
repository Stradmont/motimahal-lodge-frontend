import { apiClient, ApiResponse } from '@/lib/api-client';

export interface TestimonialItem {
  id: string;
  authorName: string;
  role?: string;
  avatarUrl?: string;
  content: string;
  rating: number;
  isFeatured?: boolean;
  status: 'PUBLISHED' | 'DRAFT';
}

export const TestimonialService = {
  async getAll(params?: any): Promise<ApiResponse<TestimonialItem[]>> {
    return apiClient.get<TestimonialItem[]>('/api/v1/admin/testimonials', params);
  },
  async getPublicAll(params?: any): Promise<ApiResponse<TestimonialItem[]>> {
    return apiClient.get<TestimonialItem[]>('/api/v1/public/testimonials', params);
  },
  async getById(id: string): Promise<ApiResponse<TestimonialItem | null>> {
    return apiClient.get<TestimonialItem>(`/api/v1/admin/testimonials/${id}`);
  },
  async create(data: Partial<TestimonialItem>): Promise<ApiResponse<TestimonialItem>> {
    return apiClient.post<TestimonialItem>('/api/v1/admin/testimonials', data);
  },
  async update(id: string, data: Partial<TestimonialItem>): Promise<ApiResponse<TestimonialItem>> {
    return apiClient.put<TestimonialItem>(`/api/v1/admin/testimonials/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/testimonials/${id}`);
  },
};
