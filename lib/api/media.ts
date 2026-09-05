import { apiClient } from '@/lib/api-client';
import { MediaItem, MediaDocumentType, MediaEntityType, MediaUsageRef } from '../types/media';

export const MEDIA_UPDATED_EVENT = 'motimahal_media_updated';

export async function fetchMediaList(
  documentType?: string,
  search?: string
): Promise<MediaItem[]> {
  const params: Record<string, string> = {};
  if (documentType && documentType !== 'ALL') params.documentType = documentType;
  if (search) params.search = search;

  const res = await apiClient.get<MediaItem[]>('/api/v1/admin/media', params);
  if (!res.success) {
    throw new Error(res.message || 'Failed to fetch media list');
  }

  return res.data || [];
}

export async function uploadMediaApi(
  file: File,
  documentType: MediaDocumentType = MediaDocumentType.IMAGE,
  entityType: MediaEntityType = MediaEntityType.GENERAL,
  entityId?: string
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  formData.append('entityType', entityType);
  if (entityId) formData.append('entityId', entityId);

  const res = await apiClient.post<MediaItem>('/api/v1/admin/media/upload', formData);
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to upload media file');
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MEDIA_UPDATED_EVENT));
  }

  return res.data;
}

export async function deleteMediaApi(id: string): Promise<boolean> {
  const res = await apiClient.delete<null>(`/api/v1/admin/media/${id}`);
  if (!res.success) {
    throw new Error(res.message || 'Failed to delete media item');
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MEDIA_UPDATED_EVENT));
  }
  return true;
}

export async function updateMediaMetadataApi(
  id: string,
  metadata: {
    name?: string;
    originalFileName?: string;
    entityType?: MediaEntityType;
    entityId?: string;
  }
): Promise<MediaItem> {
  const res = await apiClient.patch<MediaItem>(`/api/v1/admin/media/${id}`, metadata);
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to update media metadata');
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MEDIA_UPDATED_EVENT));
  }

  return res.data;
}

export async function replaceMediaFileApi(id: string, file: File): Promise<MediaItem> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds maximum limit of 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.put<MediaItem>(`/api/v1/admin/media/${id}/replace`, formData);
  if (!res.success || !res.data) {
    throw new Error(res.message || 'Failed to replace media file');
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MEDIA_UPDATED_EVENT));
  }

  return res.data;
}

export function checkMediaUsage(_media: MediaItem): MediaUsageRef[] {
  return [];
}

