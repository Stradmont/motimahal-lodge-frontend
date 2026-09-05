'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoomService } from '@/lib/services/room.service';
import { RoomItem, CreateRoomInput, RoomStatus } from '@/lib/types/room';
import { ApiResponse } from '@/lib/api-client';

export function useGetAllRooms(params?: { type?: string; status?: string; search?: string }) {
  const [data, setData] = useState<RoomItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomsList = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await RoomService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch rooms');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred fetching rooms');
    } finally {
      setIsLoading(false);
    }
  }, [params?.type, params?.status, params?.search]);

  useEffect(() => {
    fetchRoomsList();
  }, [fetchRoomsList]);

  return { data, isLoading, isError, error, refetch: fetchRoomsList };
}

export function useGetRoom(id?: string) {
  const [data, setData] = useState<RoomItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchRoom = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    const res = await RoomService.getById(id);
    if (res.success) {
      setData(res.data);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return { data, isLoading, isError, refetch: fetchRoom };
}

export function useCreateRoom() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (payload: CreateRoomInput): Promise<ApiResponse<RoomItem>> => {
    setIsPending(true);
    try {
      const res = await RoomService.create(payload);
      return res;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useUpdateRoom() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string, payload: Partial<CreateRoomInput>): Promise<ApiResponse<RoomItem>> => {
    setIsPending(true);
    try {
      const res = await RoomService.update(id, payload);
      return res;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteRoom() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<ApiResponse<null>> => {
    setIsPending(true);
    try {
      const res = await RoomService.delete(id);
      return res;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useRooms(params?: { type?: string; status?: string; search?: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAllRooms(params);
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const deleteMutation = useDeleteRoom();

  const createRoom = async (payload: CreateRoomInput) => {
    const res = await createMutation.mutateAsync(payload);
    if (res.success) refetch();
    return res;
  };

  const updateRoom = async (id: string, payload: Partial<CreateRoomInput>) => {
    const res = await updateMutation.mutateAsync(id, payload);
    if (res.success) refetch();
    return res;
  };

  const updateRoomStatus = async (id: string, status: RoomStatus) => {
    const res = await RoomService.updateStatus(id, status);
    if (res.success) refetch();
    return res;
  };

  const deleteRoom = async (id: string) => {
    const res = await deleteMutation.mutateAsync(id);
    if (res.success) refetch();
    return res;
  };

  return {
    rooms: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
