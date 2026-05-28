export interface Property {
  id: string;
  name: string;
  subdomain: string;
  createdAt: string;
}

export type RoomStatus = 'Available' | 'Booked' | 'Under Maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  status: RoomStatus;
  propertyId: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  photos: string[];
  price: number;
  amenities: string[];
  totalUnits: number;
  propertyId: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type PaymentMethod = 'eSewa' | 'Bank Transfer' | 'Pay at Hotel';

export interface PaymentDetails {
  method: PaymentMethod;
  transactionId?: string;
  screenshotUrl?: string;
  verifiedAt?: string;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDetails: PaymentDetails;
  propertyId: string;
  createdAt: string;
  notes?: string;
}

export type FoodItemCategory = 'Momo' | 'Thali' | 'Snacks' | 'Beverages' | 'Desserts' | 'Other';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodItemCategory;
  image?: string;
  isAvailable: boolean;
}

export interface OrderItem {
  foodItemId: string;
  name: string; // denormalized for easy rendering
  quantity: number;
  price: number; // locked price at time of purchase
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  roomNumber: string;
  bookingRef: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  propertyId: string;
  createdAt: string;
}

export interface MaintenanceBlock {
  id: string;
  roomTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  propertyId: string;
}
