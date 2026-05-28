'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RoomType, Room, FoodItem, Booking, Order, MaintenanceBlock, 
  BookingStatus, PaymentStatus, PaymentDetails, OrderStatus, OrderItem
} from '../types';
import { 
  INITIAL_ROOM_TYPES, INITIAL_ROOMS, INITIAL_FOOD_ITEMS, 
  INITIAL_BOOKINGS, INITIAL_ORDERS, INITIAL_MAINTENANCE, PROPERTY_ID 
} from '../lib/mockData';

interface AppContextType {
  roomTypes: RoomType[];
  rooms: Room[];
  foodItems: FoodItem[];
  bookings: Booking[];
  orders: Order[];
  maintenanceBlocks: MaintenanceBlock[];
  currentBooking: Booking | null;
  currentRoomNumber: string | null;
  cart: OrderItem[];
  isLoaded: boolean;
  
  // Room Type Management
  addRoomType: (roomType: RoomType) => void;
  updateRoomType: (roomType: RoomType) => void;
  deleteRoomType: (id: string) => void;
  
  // Maintenance Management
  addMaintenanceBlock: (block: MaintenanceBlock) => void;
  deleteMaintenanceBlock: (id: string) => void;
  
  // Booking Management
  checkAvailability: (roomTypeId: string, checkIn: string, checkOut: string) => boolean;
  getAvailableCount: (roomTypeId: string, checkIn: string, checkOut: string) => number;
  createBooking: (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'status' | 'paymentStatus' | 'paymentDetails' | 'propertyId' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus, details?: Partial<PaymentDetails>) => void;
  
  // Guest Portal Session
  loginGuest: (refNum: string, phone: string) => boolean;
  logoutGuest: () => void;
  
  // In-Room Ordering & Cart
  addToCart: (foodItem: FoodItem, quantity: number) => void;
  removeFromCart: (foodItemId: string) => void;
  updateCartQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (roomNumber: string) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [maintenanceBlocks, setMaintenanceBlocks] = useState<MaintenanceBlock[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [currentRoomNumber, setCurrentRoomNumber] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedRoomTypes = localStorage.getItem('motimahal_roomTypes');
      const storedRooms = localStorage.getItem('motimahal_rooms');
      const storedFoodItems = localStorage.getItem('motimahal_foodItems');
      const storedBookings = localStorage.getItem('motimahal_bookings');
      const storedOrders = localStorage.getItem('motimahal_orders');
      const storedMaintenance = localStorage.getItem('motimahal_maintenance');
      const storedSession = localStorage.getItem('motimahal_currentBooking');
      const storedRoomNum = localStorage.getItem('motimahal_currentRoomNumber');

      setRoomTypes(storedRoomTypes ? JSON.parse(storedRoomTypes) : INITIAL_ROOM_TYPES);
      setRooms(storedRooms ? JSON.parse(storedRooms) : INITIAL_ROOMS);
      setFoodItems(storedFoodItems ? JSON.parse(storedFoodItems) : INITIAL_FOOD_ITEMS);
      setBookings(storedBookings ? JSON.parse(storedBookings) : INITIAL_BOOKINGS);
      setOrders(storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS);
      setMaintenanceBlocks(storedMaintenance ? JSON.parse(storedMaintenance) : INITIAL_MAINTENANCE);
      
      if (storedSession) setCurrentBooking(JSON.parse(storedSession));
      if (storedRoomNum) setCurrentRoomNumber(storedRoomNum);
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      // Fallback to initial
      setRoomTypes(INITIAL_ROOM_TYPES);
      setRooms(INITIAL_ROOMS);
      setFoodItems(INITIAL_FOOD_ITEMS);
      setBookings(INITIAL_BOOKINGS);
      setOrders(INITIAL_ORDERS);
      setMaintenanceBlocks(INITIAL_MAINTENANCE);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage helpers
  const saveState = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Room Types
  const addRoomType = (newRoomType: RoomType) => {
    const updated = [...roomTypes, newRoomType];
    setRoomTypes(updated);
    saveState('motimahal_roomTypes', updated);
  };

  const updateRoomType = (updatedRoomType: RoomType) => {
    const updated = roomTypes.map(rt => rt.id === updatedRoomType.id ? updatedRoomType : rt);
    setRoomTypes(updated);
    saveState('motimahal_roomTypes', updated);
  };

  const deleteRoomType = (id: string) => {
    const updated = roomTypes.filter(rt => rt.id !== id);
    setRoomTypes(updated);
    saveState('motimahal_roomTypes', updated);
  };

  // Maintenance
  const addMaintenanceBlock = (block: MaintenanceBlock) => {
    const updated = [...maintenanceBlocks, block];
    setMaintenanceBlocks(updated);
    saveState('motimahal_maintenance', updated);
  };

  const deleteMaintenanceBlock = (id: string) => {
    const updated = maintenanceBlocks.filter(m => m.id !== id);
    setMaintenanceBlocks(updated);
    saveState('motimahal_maintenance', updated);
  };

  // Availability Helpers
  const getAvailableCount = (roomTypeId: string, checkIn: string, checkOut: string): number => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return 0;

    const totalUnits = roomType.totalUnits;

    // Check overlapping bookings
    const overlappingBookings = bookings.filter(b => {
      if (b.roomTypeId !== roomTypeId) return false;
      if (b.status === 'Cancelled') return false;
      
      // overlap condition: checkIn < b.checkOut && checkOut > b.checkIn
      return checkIn < b.checkOut && checkOut > b.checkIn;
    });

    // Check overlapping maintenance blocks
    const overlappingMaintenance = maintenanceBlocks.filter(m => {
      if (m.roomTypeId !== roomTypeId) return false;
      return checkIn < m.endDate && checkOut > m.startDate;
    });

    // Occupied = total bookings + total maintenance units (unique rooms)
    // For local simulation, we subtract overlapping count
    const occupiedCount = overlappingBookings.length + overlappingMaintenance.length;
    const available = totalUnits - occupiedCount;
    return available < 0 ? 0 : available;
  };

  const checkAvailability = (roomTypeId: string, checkIn: string, checkOut: string): boolean => {
    if (!checkIn || !checkOut) return false;
    if (new Date(checkIn) >= new Date(checkOut)) return false;
    return getAvailableCount(roomTypeId, checkIn, checkOut) > 0;
  };

  // Create Booking
  const createBooking = (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'status' | 'paymentStatus' | 'paymentDetails' | 'propertyId' | 'createdAt'>) => {
    const year = new Date().getFullYear();
    const sequence = String(bookings.length + 1).padStart(4, '0');
    const referenceNumber = `MM-${year}-${sequence}`;
    const id = `b_${Date.now()}`;

    const newBooking: Booking = {
      ...bookingData,
      id,
      referenceNumber,
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentDetails: {
        method: 'Pay at Hotel'
      },
      propertyId: PROPERTY_ID,
      createdAt: new Date().toISOString()
    };

    const updated = [...bookings, newBooking];
    setBookings(updated);
    saveState('motimahal_bookings', updated);

    // Auto-update room status if checked in immediately or booked
    // (In local simulation, we link booked rooms as details)
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        // If checked in, see if we can assign a physical room number in simulation
        let notes = b.notes || '';
        if (status === 'CheckedIn' && !notes.includes('Assigned Room:')) {
          // Find an available room of this type
          const assignedRoom = rooms.find(r => r.roomTypeId === b.roomTypeId && r.status === 'Available');
          if (assignedRoom) {
            notes = `${notes ? notes + ' | ' : '' }Assigned Room: ${assignedRoom.roomNumber}`;
            // Mark that room as booked
            const updatedRooms = rooms.map(r => r.id === assignedRoom.id ? { ...r, status: 'Booked' as const } : r);
            setRooms(updatedRooms);
            saveState('motimahal_rooms', updatedRooms);
          }
        }
        // If checked out, free the assigned room
        if (status === 'CheckedOut' && notes.includes('Assigned Room:')) {
          const match = notes.match(/Assigned Room:\s*(\w+)/);
          if (match && match[1]) {
            const roomNum = match[1];
            const updatedRooms = rooms.map(r => r.roomNumber === roomNum ? { ...r, status: 'Available' as const } : r);
            setRooms(updatedRooms);
            saveState('motimahal_rooms', updatedRooms);
          }
        }
        return { ...b, status, notes };
      }
      return b;
    });
    setBookings(updated);
    saveState('motimahal_bookings', updated);
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentStatus, details?: Partial<PaymentDetails>) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          paymentStatus,
          paymentDetails: {
            ...b.paymentDetails,
            ...details,
            verifiedAt: paymentStatus === 'Paid' ? new Date().toISOString() : b.paymentDetails.verifiedAt
          },
          // If payment confirmed, let's also auto confirm the booking status if it was Pending
          status: (paymentStatus === 'Paid' && b.status === 'Pending') ? 'Confirmed' as const : b.status
        };
      }
      return b;
    });
    setBookings(updated);
    saveState('motimahal_bookings', updated);

    // If current user is logged in, sync current booking
    const activeBooking = currentBooking ? updated.find(b => b.id === currentBooking.id) : null;
    if (activeBooking) {
      setCurrentBooking(activeBooking);
      saveState('motimahal_currentBooking', activeBooking);
    }
  };

  // Guest portal session
  const loginGuest = (refNum: string, phone: string): boolean => {
    const match = bookings.find(
      b => b.referenceNumber.toLowerCase() === refNum.trim().toLowerCase() && 
      b.guestPhone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')
    );

    if (match) {
      setCurrentBooking(match);
      saveState('motimahal_currentBooking', match);

      // Guess/assign a room number from notes or layout for ordering food
      let roomNum = '101'; // Default
      const matchRoom = match.notes?.match(/Assigned Room:\s*(\w+)/);
      if (matchRoom && matchRoom[1]) {
        roomNum = matchRoom[1];
      } else {
        // Fallback guess based on room type
        if (match.roomTypeId === 'deluxe') roomNum = '102';
        else if (match.roomTypeId === 'standard') roomNum = '201';
        else roomNum = '301';
      }
      setCurrentRoomNumber(roomNum);
      if (typeof window !== 'undefined') {
        localStorage.setItem('motimahal_currentRoomNumber', roomNum);
      }
      return true;
    }
    return false;
  };

  const logoutGuest = () => {
    setCurrentBooking(null);
    setCurrentRoomNumber(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('motimahal_currentBooking');
      localStorage.removeItem('motimahal_currentRoomNumber');
    }
  };

  // Cart
  const addToCart = (foodItem: FoodItem, quantity: number) => {
    const existing = cart.find(item => item.foodItemId === foodItem.id);
    if (existing) {
      setCart(cart.map(item => 
        item.foodItemId === foodItem.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        foodItemId: foodItem.id,
        name: foodItem.name,
        quantity,
        price: foodItem.price
      }]);
    }
  };

  const removeFromCart = (foodItemId: string) => {
    setCart(cart.filter(item => item.foodItemId !== foodItemId));
  };

  const updateCartQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
    } else {
      setCart(cart.map(item => 
        item.foodItemId === foodItemId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Food Order
  const placeOrder = (roomNum: string) => {
    if (cart.length === 0) return null;

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `o_${Date.now()}`,
      roomNumber: roomNum || currentRoomNumber || '101',
      bookingRef: currentBooking?.referenceNumber || 'WALK-IN',
      items: [...cart],
      totalAmount,
      status: 'Placed',
      propertyId: PROPERTY_ID,
      createdAt: new Date().toISOString()
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    saveState('motimahal_orders', updated);
    setCart([]); // Clear cart
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveState('motimahal_orders', updated);
  };

  return (
    <AppContext.Provider value={{
      roomTypes,
      rooms,
      foodItems,
      bookings,
      orders,
      maintenanceBlocks,
      currentBooking,
      currentRoomNumber,
      cart,
      isLoaded,
      addRoomType,
      updateRoomType,
      deleteRoomType,
      addMaintenanceBlock,
      deleteMaintenanceBlock,
      checkAvailability,
      getAvailableCount,
      createBooking,
      updateBookingStatus,
      updatePaymentStatus,
      loginGuest,
      logoutGuest,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
