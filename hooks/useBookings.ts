'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookingService, BookingItem } from '@/lib/services/booking.service';
import { ApiResponse } from '@/lib/api-client';

export function useBookings(params?: any) {
  const [data, setData] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await BookingService.getAll(params);
      if (res.success && res.data) setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (payload: Partial<BookingItem>): Promise<ApiResponse<BookingItem>> => {
    const res = await BookingService.create(payload);
    if (res.success) fetchBookings();
    return res;
  };

  const updateBooking = async (id: string, payload: Partial<BookingItem>): Promise<ApiResponse<BookingItem>> => {
    const res = await BookingService.update(id, payload);
    if (res.success) fetchBookings();
    return res;
  };

  const deleteBooking = async (id: string): Promise<ApiResponse<null>> => {
    const res = await BookingService.delete(id);
    if (res.success) fetchBookings();
    return res;
  };

  return {
    bookings: data,
    data,
    isLoading,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
}
