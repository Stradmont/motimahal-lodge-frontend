import { apiClient, ApiResponse } from '@/lib/api-client';
import { GallerySectionItem, CreateGallerySectionInput } from '@/lib/types/gallery';

export const GalleryService = {
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<GallerySectionItem[]>> {
    return apiClient.get<GallerySectionItem[]>('/api/v1/gallery', params);
  },

  async getById(id: string): Promise<ApiResponse<GallerySectionItem | null>> {
    return apiClient.get<GallerySectionItem>(`/api/v1/gallery/${id}`);
  },

  async create(input: CreateGallerySectionInput): Promise<ApiResponse<GallerySectionItem>> {
    return apiClient.post<GallerySectionItem>('/api/v1/gallery', input);
  },

  async update(id: string, input: Partial<CreateGallerySectionInput>): Promise<ApiResponse<GallerySectionItem>> {
    return apiClient.put<GallerySectionItem>(`/api/v1/gallery/${id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/gallery/${id}`);
  },
};
