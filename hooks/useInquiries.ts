'use client';

import { useState, useEffect, useCallback } from 'react';
import { InquiryService } from '@/lib/services/inquiry.service';
import { RoomInquiry } from '@/lib/types/inquiry';
import { ApiResponse } from '@/lib/api-client';

import { INQUIRIES_EVENT } from '@/lib/storage/inquiries';

export function useGetAllInquiries(params?: { status?: string; search?: string }) {
  const [data, setData] = useState<RoomInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const res = await InquiryService.getAll(params);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setIsError(true);
        setError(res.message || 'Failed to fetch inquiries');
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params?.status, params?.search]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleUpdate = () => fetchInquiries();
      window.addEventListener(INQUIRIES_EVENT, handleUpdate);
      return () => window.removeEventListener(INQUIRIES_EVENT, handleUpdate);
    }
  }, [fetchInquiries]);

  return { data, isLoading, isError, error, refetch: fetchInquiries };
}

export function useInquiries(params?: { status?: string; search?: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAllInquiries(params);

  const notify = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(INQUIRIES_EVENT));
    }
  };

  const createInquiry = async (payload: Partial<RoomInquiry>) => {
    const res = await InquiryService.create(payload);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  const updateInquiry = async (id: string, payload: Partial<RoomInquiry>) => {
    const res = await InquiryService.update(id, payload);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  const deleteInquiry = async (id: string) => {
    const res = await InquiryService.delete(id);
    if (res.success) {
      refetch();
      notify();
    }
    return res;
  };

  return {
    inquiries: data,
    data,
    isLoading,
    isError,
    error,
    refetch,
    createInquiry,
    updateInquiry,
    deleteInquiry,
  };
}
