import { apiClient, ApiResponse } from '@/lib/api-client';
import { BlogItem, BlogQueryParams } from '@/lib/types/blog';

export const AdminBlogService = {
  async getAll(params?: BlogQueryParams): Promise<ApiResponse<BlogItem[]>> {
    return apiClient.get<BlogItem[]>('/api/v1/admin/blogs', params);
  },
  async getById(id: string): Promise<ApiResponse<BlogItem | null>> {
    return apiClient.get<BlogItem>(`/api/v1/admin/blogs/${id}`);
  },
  async create(data: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> {
    return apiClient.post<BlogItem>('/api/v1/admin/blogs', data);
  },
  async update(id: string, data: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> {
    return apiClient.put<BlogItem>(`/api/v1/admin/blogs/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/blogs/${id}`);
  },
};

export const PublicBlogService = {
  async getAll(params?: BlogQueryParams): Promise<ApiResponse<BlogItem[]>> {
    return apiClient.get<BlogItem[]>('/api/v1/public/blogs', params);
  },
  async getBySlug(slug: string): Promise<ApiResponse<BlogItem>> {
    return apiClient.get<BlogItem>(`/api/v1/public/blogs/${slug}`);
  },
};

export const BlogService = {
  ...AdminBlogService,
  getPublicAll: PublicBlogService.getAll,
  getPublicBySlug: PublicBlogService.getBySlug,
};
