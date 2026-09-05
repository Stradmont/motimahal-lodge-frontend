import { apiClient, ApiResponse } from '@/lib/api-client';

export interface BookingItem {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmount: number;
  createdAt: string;
}

export const BookingService = {
  async getAll(params?: any): Promise<ApiResponse<BookingItem[]>> {
    return apiClient.get<BookingItem[]>('/api/v1/bookings', params);
  },
  async getById(id: string): Promise<ApiResponse<BookingItem | null>> {
    return apiClient.get<BookingItem>(`/api/v1/bookings/${id}`);
  },
  async create(data: Partial<BookingItem>): Promise<ApiResponse<BookingItem>> {
    return apiClient.post<BookingItem>('/api/v1/bookings', data);
  },
  async update(id: string, data: Partial<BookingItem>): Promise<ApiResponse<BookingItem>> {
    return apiClient.put<BookingItem>(`/api/v1/bookings/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/bookings/${id}`);
  },
};
