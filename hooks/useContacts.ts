'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactService } from '@/lib/services/contact.service';
import { GeneralContactInquiry, GeneralContactStatus } from '@/lib/types/inquiry';
import { ApiResponse } from '@/lib/api-client';

import { INQUIRIES_EVENT } from '@/lib/storage/inquiries';

export function useGetAllContacts(params?: { status?: string; search?: string }) {
  const [data, setData] = useState<GeneralContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await ContactService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch contact inquiries');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.status, params?.search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleUpdate = () => fetchContacts();
      window.addEventListener(INQUIRIES_EVENT, handleUpdate);
      return () => window.removeEventListener(INQUIRIES_EVENT, handleUpdate);
    }
  }, [fetchContacts]);

  return { data, isLoading, isError, error, refetch: fetchContacts };
}

export function useUpdateContactStatus() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string, status: GeneralContactStatus): Promise<ApiResponse<GeneralContactInquiry>> => {
    setIsPending(true);
    try {
      return await ContactService.updateStatus(id, status);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useDeleteContact() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<ApiResponse<null>> => {
    setIsPending(true);
    try {
      return await ContactService.delete(id);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}

export function useContacts(params?: { status?: string; search?: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAllContacts(params);
  const updateStatusMutation = useUpdateContactStatus();
  const deleteMutation = useDeleteContact();

  const notify = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(INQUIRIES_EVENT));
    }
  };

  const updateContact = async (id: string, payload: Partial<GeneralContactInquiry>) => {
    const res = await ContactService.update(id, payload);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  const updateStatus = async (id: string, status: GeneralContactStatus) => {
    const res = await updateStatusMutation.mutateAsync(id, status);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  const deleteContact = async (id: string) => {
    const res = await deleteMutation.mutateAsync(id);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  return {
    submissions: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    updateContact,
    updateStatus,
    deleteContact,
    isMutating: updateStatusMutation.isPending || deleteMutation.isPending,
  };
}
