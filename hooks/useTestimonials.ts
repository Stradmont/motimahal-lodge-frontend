'use client';

import { useState, useEffect, useCallback } from 'react';
import { TestimonialService, TestimonialItem } from '@/lib/services/testimonial.service';
import { ApiResponse } from '@/lib/api-client';

export function useTestimonials(params?: any) {
  const [data, setData] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await TestimonialService.getAll(params);
      if (res.success && res.data) setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const createTestimonial = async (payload: Partial<TestimonialItem>): Promise<ApiResponse<TestimonialItem>> => {
    const res = await TestimonialService.create(payload);
    if (res.success) fetchTestimonials();
    return res;
  };

  const updateTestimonial = async (id: string, payload: Partial<TestimonialItem>): Promise<ApiResponse<TestimonialItem>> => {
    const res = await TestimonialService.update(id, payload);
    if (res.success) fetchTestimonials();
    return res;
  };

  const deleteTestimonial = async (id: string): Promise<ApiResponse<null>> => {
    const res = await TestimonialService.delete(id);
    if (res.success) fetchTestimonials();
    return res;
  };

  return {
    testimonials: data,
    data,
    isLoading,
    refetch: fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
}
