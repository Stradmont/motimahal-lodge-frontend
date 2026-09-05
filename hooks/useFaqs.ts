'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaqService, FaqItem } from '@/lib/services/faq.service';
import { ApiResponse } from '@/lib/api-client';

export function useFaqs(params?: any) {
  const [data, setData] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await FaqService.getAll(params);
      if (res.success && res.data) setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const createFaq = async (payload: Partial<FaqItem>): Promise<ApiResponse<FaqItem>> => {
    const res = await FaqService.create(payload);
    if (res.success) fetchFaqs();
    return res;
  };

  const updateFaq = async (id: string, payload: Partial<FaqItem>): Promise<ApiResponse<FaqItem>> => {
    const res = await FaqService.update(id, payload);
    if (res.success) fetchFaqs();
    return res;
  };

  const deleteFaq = async (id: string): Promise<ApiResponse<null>> => {
    const res = await FaqService.delete(id);
    if (res.success) fetchFaqs();
    return res;
  };

  return {
    faqs: data,
    data,
    isLoading,
    refetch: fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
  };
}
