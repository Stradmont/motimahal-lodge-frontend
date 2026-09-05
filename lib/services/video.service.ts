import { apiClient, ApiResponse } from '@/lib/api-client';
import { VideoItem, CreateVideoInput } from '@/lib/types/video';

export const AdminVideoService = {
  async getAll(params?: { category?: string; status?: string; search?: string }): Promise<ApiResponse<VideoItem[]>> {
    return apiClient.get<VideoItem[]>('/api/v1/admin/videos', params);
  },

  async getById(id: string): Promise<ApiResponse<VideoItem | null>> {
    return apiClient.get<VideoItem>(`/api/v1/admin/videos/${id}`);
  },

  async create(input: CreateVideoInput): Promise<ApiResponse<VideoItem>> {
    return apiClient.post<VideoItem>('/api/v1/admin/videos', input);
  },

  async update(id: string, input: Partial<CreateVideoInput>): Promise<ApiResponse<VideoItem>> {
    return apiClient.put<VideoItem>(`/api/v1/admin/videos/${id}`, input);
  },

  async reorder(items: VideoItem[]): Promise<ApiResponse<VideoItem[]>> {
    return apiClient.put<VideoItem[]>('/api/v1/admin/videos/reorder', { items });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/videos/${id}`);
  },
};

export const PublicVideoService = {
  async getAll(params?: { category?: string }): Promise<ApiResponse<VideoItem[]>> {
    return apiClient.get<VideoItem[]>('/api/v1/public/videos', params);
  },
};

export const VideoService = {
  ...AdminVideoService,
  getPublicAll: PublicVideoService.getAll,
};
