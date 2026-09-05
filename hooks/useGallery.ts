'use client';

import { useState, useEffect, useCallback } from 'react';
import { GalleryService } from '@/lib/services/gallery.service';
import { GallerySectionItem, CreateGallerySectionInput, GalleryCategory } from '@/lib/types/gallery';
import { ApiResponse } from '@/lib/api-client';

export function useGetAllGallerySections(params?: { status?: string; search?: string; category?: GalleryCategory }) {
  const [data, setData] = useState<GallerySectionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await GalleryService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch gallery sections');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.status, params?.search, params?.category]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return { data, isLoading, isError, error, refetch: fetchSections };
}

export function useCreateGallerySection() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (payload: CreateGallerySectionInput): Promise<ApiResponse<GallerySectionItem>> => {
    setIsPending(true);
    try {
      return await GalleryService.create(payload);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useUpdateGallerySection() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string, payload: Partial<CreateGallerySectionInput>): Promise<ApiResponse<GallerySectionItem>> => {
    setIsPending(true);
    try {
      return await GalleryService.update(id, payload);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteGallerySection() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<ApiResponse<null>> => {
    setIsPending(true);
    try {
      return await GalleryService.delete(id);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useGallery(params?: { status?: string; search?: string; category?: GalleryCategory }) {
  const { data, isLoading, isError, error, refetch } = useGetAllGallerySections(params);
  const createMutation = useCreateGallerySection();
  const updateMutation = useUpdateGallerySection();
  const deleteMutation = useDeleteGallerySection();

  const createSection = async (payload: CreateGallerySectionInput) => {
    const res = await createMutation.mutateAsync(payload);
    if (res.success) refetch();
    return res;
  };

  const updateSection = async (id: string, payload: Partial<CreateGallerySectionInput>) => {
    const res = await updateMutation.mutateAsync(id, payload);
    if (res.success) refetch();
    return res;
  };

  const deleteSection = async (id: string) => {
    const res = await deleteMutation.mutateAsync(id);
    if (res.success) refetch();
    return res;
  };

  return {
    sections: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    createSection,
    updateSection,
    deleteSection,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
