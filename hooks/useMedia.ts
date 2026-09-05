'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaService } from '@/lib/services/media.service';
import { MediaItem, MediaDocumentType, MediaEntityType } from '@/lib/types/media';
import { ApiResponse } from '@/lib/api-client';

export function useGetAllMedia(params?: { documentType?: string; search?: string }) {
  const [data, setData] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await MediaService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch media assets');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.documentType, params?.search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { data, isLoading, isError, error, refetch: fetchMedia };
}

export function useUploadMedia() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (
    file: File,
    documentType: MediaDocumentType,
    entityType: MediaEntityType,
    entityId?: string
  ): Promise<ApiResponse<MediaItem>> => {
    setIsPending(true);
    try {
      return await MediaService.upload(file, documentType, entityType, entityId);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteMedia() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<ApiResponse<null>> => {
    setIsPending(true);
    try {
      return await MediaService.delete(id);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useMedia(params?: { documentType?: string; search?: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAllMedia(params);
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const uploadMedia = async (
    file: File,
    documentType: MediaDocumentType,
    entityType: MediaEntityType,
    entityId?: string
  ) => {
    const res = await uploadMutation.mutateAsync(file, documentType, entityType, entityId);
    if (res.success) refetch();
    return res;
  };

  const updateMedia = async (id: string, payload: Partial<MediaItem>) => {
    const res = await MediaService.update(id, payload);
    if (res.success) refetch();
    return res;
  };

  const deleteMedia = async (id: string) => {
    const res = await deleteMutation.mutateAsync(id);
    if (res.success) refetch();
    return res;
  };

  return {
    mediaItems: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    uploadMedia,
    updateMedia,
    deleteMedia,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
