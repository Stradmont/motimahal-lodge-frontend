import { apiClient, ApiResponse } from '@/lib/api-client';
import { GallerySectionItem, CreateGallerySectionInput } from '@/lib/types/gallery';

export const AdminGalleryService = {
  async getAll(params?: { status?: string; search?: string }): Promise<ApiResponse<GallerySectionItem[]>> {
    return apiClient.get<GallerySectionItem[]>('/api/v1/admin/gallery', params);
  },

  async getById(id: string): Promise<ApiResponse<GallerySectionItem | null>> {
    return apiClient.get<GallerySectionItem>(`/api/v1/admin/gallery/${id}`);
  },

  async create(input: CreateGallerySectionInput): Promise<ApiResponse<GallerySectionItem>> {
    return apiClient.post<GallerySectionItem>('/api/v1/admin/gallery', input);
  },

  async update(id: string, input: Partial<CreateGallerySectionInput>): Promise<ApiResponse<GallerySectionItem>> {
    return apiClient.put<GallerySectionItem>(`/api/v1/admin/gallery/${id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/gallery/${id}`);
  },
};

export const PublicGalleryService = {
  async getAll(): Promise<ApiResponse<GallerySectionItem[]>> {
    return apiClient.get<GallerySectionItem[]>('/api/v1/public/gallery');
  },

  async getBySlug(slug: string): Promise<ApiResponse<GallerySectionItem>> {
    return apiClient.get<GallerySectionItem>(`/api/v1/public/gallery/${slug}`);
  },
};

export const GalleryService = {
  ...AdminGalleryService,
  getPublicAll: PublicGalleryService.getAll,
  getPublicBySlug: PublicGalleryService.getBySlug,
};
