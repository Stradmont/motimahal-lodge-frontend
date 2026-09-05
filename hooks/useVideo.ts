'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoService } from '@/lib/services/video.service';
import { VideoItem, CreateVideoInput } from '@/lib/types/video';
import { ApiResponse } from '@/lib/api-client';

export function useGetAllVideos(params?: { category?: string; status?: string; search?: string }) {
  const [data, setData] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await VideoService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch videos');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.status, params?.search]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { data, isLoading, isError, error, refetch: fetchVideos };
}

export function useGetVideo(id?: string) {
  const [data, setData] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  const fetchVideo = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    const res = await VideoService.getById(id);
    if (res.success) setData(res.data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { data, isLoading, refetch: fetchVideo };
}

export function useCreateVideo() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (payload: CreateVideoInput): Promise<ApiResponse<VideoItem>> => {
    setIsPending(true);
    try {
      return await VideoService.create(payload);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useUpdateVideo() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string, payload: Partial<CreateVideoInput>): Promise<ApiResponse<VideoItem>> => {
    setIsPending(true);
    try {
      return await VideoService.update(id, payload);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteVideo() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<ApiResponse<null>> => {
    setIsPending(true);
    try {
      return await VideoService.delete(id);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useVideo(params?: { category?: string; status?: string; search?: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAllVideos(params);
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const createVideo = async (payload: CreateVideoInput) => {
    const res = await createMutation.mutateAsync(payload);
    if (res.success) refetch();
    return res;
  };

  const updateVideo = async (id: string, payload: Partial<CreateVideoInput>) => {
    const res = await updateMutation.mutateAsync(id, payload);
    if (res.success) refetch();
    return res;
  };

  const reorderVideos = async (items: VideoItem[]) => {
    const res = await VideoService.reorder(items);
    if (res.success) refetch();
    return res;
  };

  const deleteVideo = async (id: string) => {
    const res = await deleteMutation.mutateAsync(id);
    if (res.success) refetch();
    return res;
  };

  return {
    videos: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    createVideo,
    updateVideo,
    reorderVideos,
    deleteVideo,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
