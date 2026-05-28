import { RoomType, Room, FoodItem, Booking, Order, MaintenanceBlock } from '../types';

export const PROPERTY_ID = 'motimahal-chitwan';

export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    description: 'Spacious air-conditioned room featuring a private balcony with breathtaking views of the Chitwan National Park landscape. Perfect for couples and families seeking comfort and nature.',
    photos: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ],
    price: 4500,
    amenities: [
      'Air Conditioning',
      'Private Balcony',
      'Attached Bathroom',
      'King Size Bed',
      'Free High-Speed Wi-Fi',
      'Smart TV with Netflix',
      'Mini Bar & Kettle',
      '24/7 Hot & Cold Shower',
      'Jungle View'
    ],
    totalUnits: 5,
    propertyId: PROPERTY_ID
  },
  {
    id: 'standard',
    name: 'Standard Room',
    description: 'Cozy and comfortable standard room looking out to our lush garden lawns. Equipped with all essential amenities for a pleasant stay in Sauraha.',
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'
    ],
    price: 3000,
    amenities: [
      'Attached Bathroom',
      'Queen Size Bed',
      'Free High-Speed Wi-Fi',
      'Led TV',
      'Hot & Cold Water Shower',
      'Wall Fan',
      'Garden View',
      'Complimentary Bottled Water'
    ],
    totalUnits: 10,
    propertyId: PROPERTY_ID
  },
  {
    id: 'normal',
    name: 'Normal Room',
    description: 'Budget-friendly, clean and simple room with twin beds. Ideal for backpackers and solo travellers looking for a reliable resting spot between jungle excursions.',
    photos: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
    ],
    price: 1800,
    amenities: [
      'Twin Beds',
      'Shared Bathroom',
      'Free High-Speed Wi-Fi',
      'Wall Fan',
      'Mosquito Netting',
      'Towels & Toiletries Provided'
    ],
    totalUnits: 15,
    propertyId: PROPERTY_ID
  }
];

export const INITIAL_ROOMS: Room[] = [
  // Deluxe (101-105)
  { id: 'r101', roomNumber: '101', roomTypeId: 'deluxe', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r102', roomNumber: '102', roomTypeId: 'deluxe', status: 'Booked', propertyId: PROPERTY_ID },
  { id: 'r103', roomNumber: '103', roomTypeId: 'deluxe', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r104', roomNumber: '104', roomTypeId: 'deluxe', status: 'Under Maintenance', propertyId: PROPERTY_ID },
  { id: 'r105', roomNumber: '105', roomTypeId: 'deluxe', status: 'Available', propertyId: PROPERTY_ID },
  
  // Standard (201-210)
  { id: 'r201', roomNumber: '201', roomTypeId: 'standard', status: 'Booked', propertyId: PROPERTY_ID },
  { id: 'r202', roomNumber: '202', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r203', roomNumber: '203', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r204', roomNumber: '204', roomTypeId: 'standard', status: 'Booked', propertyId: PROPERTY_ID },
  { id: 'r205', roomNumber: '205', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r206', roomNumber: '206', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r207', roomNumber: '207', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r208', roomNumber: '208', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r209', roomNumber: '209', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r210', roomNumber: '210', roomTypeId: 'standard', status: 'Available', propertyId: PROPERTY_ID },

  // Normal (301-315)
  { id: 'r301', roomNumber: '301', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r302', roomNumber: '302', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r303', roomNumber: '303', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r304', roomNumber: '304', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r305', roomNumber: '305', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r306', roomNumber: '306', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r307', roomNumber: '307', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r308', roomNumber: '308', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r309', roomNumber: '309', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r310', roomNumber: '310', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r311', roomNumber: '311', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r312', roomNumber: '312', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r313', roomNumber: '313', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r314', roomNumber: '314', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID },
  { id: 'r315', roomNumber: '315', roomTypeId: 'normal', status: 'Available', propertyId: PROPERTY_ID }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f101',
    name: 'Chicken Steam Momo',
    description: 'Freshly minced chicken mixed with house spices, steamed to perfection, served with spicy tomato chutney.',
    price: 250,
    category: 'Momo',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f102',
    name: 'Veg Steam Momo',
    description: 'Healthy seasonal minced vegetables, cabbage, carrots, onion and paneer filling, steamed and served with peanut-sesame dipping sauce.',
    price: 200,
    category: 'Momo',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f103',
    name: 'Chicken Chili Momo',
    description: 'Steamed chicken momos tossed in a hot and tangy bell pepper, onion, garlic, and red chili sauce.',
    price: 320,
    category: 'Momo',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f201',
    name: 'Veg Thakali Khana Set',
    description: 'Traditional Thakali meal set featuring local premium rice, black lentil soup (Maas ko Bara), organic spinach, seasonal vegetable curry, spicy potato pickle, fried bitter gourd, salad, and ghee.',
    price: 350,
    category: 'Thali',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f202',
    name: 'Chicken Thakali Khana Set',
    description: 'Authentic Thakali platter with local rice, country-style chicken curry, black lentil soup, organic spinach, spicy pickles, curd, and ghee.',
    price: 450,
    category: 'Thali',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f301',
    name: 'French Fries',
    description: 'Crispy golden potato fingers tossed in salt and herbs, served with ketchup.',
    price: 150,
    category: 'Snacks',
    isAvailable: true
  },
  {
    id: 'f302',
    name: 'Chicken Chili (Dry)',
    description: 'Boneless chicken cubes stir-fried with green chilies, onions, bell peppers, soy sauce, and aromatic garlic spices.',
    price: 350,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=300',
    isAvailable: true
  },
  {
    id: 'f401',
    name: 'Mineral Water (1L)',
    description: 'Chilled local Himalayan spring bottled water.',
    price: 50,
    category: 'Beverages',
    isAvailable: true
  },
  {
    id: 'f402',
    name: 'Coca Cola / Fanta / Sprite',
    description: '250ml cold soft drink bottle.',
    price: 100,
    category: 'Beverages',
    isAvailable: true
  },
  {
    id: 'f403',
    name: 'Sweet Banana Lassi',
    description: 'Creamy blended yoghurt drink with fresh local organic bananas, sugar, cardamom, and sliced almonds.',
    price: 180,
    category: 'Beverages',
    isAvailable: true
  },
  {
    id: 'f404',
    name: 'Nepali Masala Tea',
    description: 'Brewed milk tea with black tea leaves, cinnamon, cloves, cardamom, ginger, and sugar.',
    price: 60,
    category: 'Beverages',
    isAvailable: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    referenceNumber: 'MM-2026-0001',
    guestName: 'Anil Gurung',
    guestEmail: 'anil@gmail.com',
    guestPhone: '9841234567',
    roomTypeId: 'deluxe',
    checkIn: '2026-05-28',
    checkOut: '2026-05-30',
    numGuests: 2,
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    paymentDetails: {
      method: 'eSewa',
      transactionId: 'TXN-ESEWA-987452',
      verifiedAt: '2026-05-27T10:00:00Z'
    },
    propertyId: PROPERTY_ID,
    createdAt: '2026-05-27T09:30:00Z',
    notes: 'Requires early check-in and room 102.'
  },
  {
    id: 'b2',
    referenceNumber: 'MM-2026-0002',
    guestName: 'Sita Dahal',
    guestEmail: 'sita.dahal@outlook.com',
    guestPhone: '9813987654',
    roomTypeId: 'standard',
    checkIn: '2026-05-29',
    checkOut: '2026-06-01',
    numGuests: 1,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentDetails: {
      method: 'Bank Transfer',
      screenshotUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400',
      verifiedAt: '2026-05-28T08:15:00Z'
    },
    propertyId: PROPERTY_ID,
    createdAt: '2026-05-27T14:20:00Z',
    notes: 'No spices in food, please.'
  },
  {
    id: 'b3',
    referenceNumber: 'MM-2026-0003',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    guestPhone: '9801122334',
    roomTypeId: 'normal',
    checkIn: '2026-05-30',
    checkOut: '2026-06-03',
    numGuests: 2,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentDetails: {
      method: 'Pay at Hotel'
    },
    propertyId: PROPERTY_ID,
    createdAt: '2026-05-28T09:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    roomNumber: '102',
    bookingRef: 'MM-2026-0001',
    items: [
      { foodItemId: 'f101', name: 'Chicken Steam Momo', quantity: 2, price: 250 },
      { foodItemId: 'f402', name: 'Coca Cola / Fanta / Sprite', quantity: 2, price: 100 }
    ],
    totalAmount: 700,
    status: 'Delivered',
    propertyId: PROPERTY_ID,
    createdAt: '2026-05-28T08:30:00Z'
  },
  {
    id: 'o2',
    roomNumber: '102',
    bookingRef: 'MM-2026-0001',
    items: [
      { foodItemId: 'f202', name: 'Chicken Thakali Khana Set', quantity: 1, price: 450 },
      { foodItemId: 'f403', name: 'Sweet Banana Lassi', quantity: 1, price: 180 }
    ],
    totalAmount: 630,
    status: 'Preparing',
    propertyId: PROPERTY_ID,
    createdAt: '2026-05-28T09:05:00Z'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceBlock[] = [
  {
    id: 'm1',
    roomTypeId: 'deluxe',
    startDate: '2026-06-05',
    endDate: '2026-06-08',
    reason: 'AC Repair and Painting',
    propertyId: PROPERTY_ID
  }
];
