import { apiClient, ApiResponse } from '@/lib/api-client';
import { MediaItem, MediaDocumentType, MediaEntityType } from '@/lib/types/media';

export const MediaService = {
  async getAll(params?: { documentType?: string; search?: string }): Promise<ApiResponse<MediaItem[]>> {
    return apiClient.get<MediaItem[]>('/api/v1/admin/media', params);
  },

  async upload(
    file: File,
    documentType: MediaDocumentType,
    entityType: MediaEntityType,
    entityId?: string
  ): Promise<ApiResponse<MediaItem>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);

    return apiClient.post<MediaItem>('/api/v1/admin/media/upload', formData);
  },

  async update(id: string, input: Partial<MediaItem>): Promise<ApiResponse<MediaItem>> {
    return apiClient.put<MediaItem>(`/api/v1/admin/media/${id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/media/${id}`);
  },
};
