import { apiClient, ApiResponse } from '@/lib/api-client';

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  authorName?: string;
  imageUrl?: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
}

export const BlogService = {
  async getAll(params?: any): Promise<ApiResponse<BlogItem[]>> {
    return apiClient.get<BlogItem[]>('/api/v1/blogs', params);
  },
  async getById(id: string): Promise<ApiResponse<BlogItem | null>> {
    return apiClient.get<BlogItem>(`/api/v1/blogs/${id}`);
  },
  async create(data: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> {
    return apiClient.post<BlogItem>('/api/v1/blogs', data);
  },
  async update(id: string, data: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> {
    return apiClient.put<BlogItem>(`/api/v1/blogs/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/blogs/${id}`);
  },
};
