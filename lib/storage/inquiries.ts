import { GeneralContactInquiry, RoomInquiry, GeneralContactStatus, RoomInquiryStatus } from '../types/inquiry';

const GENERAL_STORAGE_KEY = 'motimahal_general_inquiries_v2';
const ROOM_STORAGE_KEY = 'motimahal_room_inquiries_v2';
const INQUIRIES_EVENT = 'motimahal_inquiries_updated';

const initialGeneralInquiries: GeneralContactInquiry[] = [
  {
    id: 'G-101',
    name: 'Sophia Patel',
    email: 'sophia.patel@gmail.com',
    phone: '+977 9808765432',
    subject: 'Family Dinner Reservation & Tandoori Menu Query',
    message:
      'We are planning a family dinner for 12 guests this Saturday evening around 7:30 PM. We would love a riverside table view and special tandoori platters.',
    date: '2026-09-04 11:15',
    status: GeneralContactStatus.NEW,
    category: 'Restaurant & Dining',
    isUrgent: true,
    history: [
      { id: 'h1', timestamp: '2026-09-04 11:15', action: 'Inquiry received from website contact form' }
    ]
  },
  {
    id: 'G-102',
    name: 'Bikash Thapa',
    email: 'bikash.thapa@company.com',
    phone: '+977 9856012345',
    subject: 'Corporate Team Retreat & Hall Booking',
    message:
      'We are organizing a corporate retreat for 25 executives in November. Please send us package details for lodging, meeting space, and breakfast/dinner buffets.',
    date: '2026-09-03 16:45',
    status: GeneralContactStatus.IN_PROGRESS,
    category: 'Events & Catering',
    internalNotes: 'Contacted Event Sales Manager. Preparing customized PDF package quote.',
    history: [
      { id: 'h1', timestamp: '2026-09-03 16:45', action: 'Inquiry received from website contact form' },
      { id: 'h2', timestamp: '2026-09-04 09:30', action: 'Stage updated: New → In Progress', author: 'Admin Staff' }
    ]
  },
  {
    id: 'G-103',
    name: 'Elena Rostova',
    email: 'elena.rostova@globemail.com',
    phone: '+44 20 7946 0912',
    subject: 'Group Tour Bus Parking Inquiry',
    message:
      'We have a tour group arriving by coach. Is there ample secure parking on site for a full-size bus?',
    date: '2026-08-30 13:00',
    status: GeneralContactStatus.WAITING_FOR_CUSTOMER,
    category: 'General Inquiry',
    internalNotes: 'Sent parking dimensions and entry gate map. Awaiting guest arrival details.',
    history: [
      { id: 'h1', timestamp: '2026-08-30 13:00', action: 'Inquiry received from website contact form' },
      { id: 'h2', timestamp: '2026-08-31 10:15', action: 'Reply email sent to guest: Parking map attached', author: 'Front Desk' },
      { id: 'h3', timestamp: '2026-08-31 10:15', action: 'Stage updated: In Progress → Waiting for Customer', author: 'Front Desk' }
    ]
  },
  {
    id: 'G-104',
    name: 'Rajesh Manandhar',
    email: 'rajesh.m@gmail.com',
    phone: '+977 9812345678',
    subject: 'Wedding Anniversary Special Decoration Request',
    message:
      'Booking a 2-night stay for our 10th wedding anniversary. Can you arrange candle-light dinner on the riverfront terrace?',
    date: '2026-08-28 09:20',
    status: GeneralContactStatus.RESOLVED,
    category: 'Special Requests',
    internalNotes: 'Arranged terrace table for Sept 10. Anniversary cake ordered.',
    history: [
      { id: 'h1', timestamp: '2026-08-28 09:20', action: 'Inquiry received from website contact form' },
      { id: 'h2', timestamp: '2026-08-29 11:00', action: 'Stage updated: Waiting for Customer → Resolved', author: 'Manager' }
    ]
  },
  {
    id: 'G-105',
    name: 'Maya Lin',
    email: 'maya.lin@travelagency.com',
    phone: '+65 9123 4567',
    subject: 'Annual Travel Agency Partnership Proposal',
    message:
      'We represent a Singapore travel agency looking for preferred room rates for eco-tour groups in 2027.',
    date: '2026-08-20 15:10',
    status: GeneralContactStatus.CLOSED,
    category: 'Partnership',
    internalNotes: 'Partnership agreement signed and stored in official records.',
    history: [
      { id: 'h1', timestamp: '2026-08-20 15:10', action: 'Inquiry received' },
      { id: 'h2', timestamp: '2026-08-25 16:30', action: 'Stage updated: Resolved → Closed', author: 'Admin' }
    ]
  }
];

const initialRoomInquiries: RoomInquiry[] = [
  {
    id: 'RM-201',
    guestName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+977 9841234567',
    roomType: 'Deluxe River View Suite',
    checkIn: '2026-10-12',
    checkOut: '2026-10-15',
    guestsCount: 3,
    specialRequests: 'High floor preferred, airport pickup needed from Bharatpur Airport at 2 PM.',
    date: '2026-09-04 14:30',
    status: RoomInquiryStatus.NEW,
    isUrgent: true,
    history: [
      { id: 'h1', timestamp: '2026-09-04 14:30', action: 'Room inquiry submitted by guest' }
    ]
  },
  {
    id: 'RM-202',
    guestName: 'Jessica Taylor',
    email: 'jessica.t@usatravel.org',
    phone: '+1 415 555 0199',
    roomType: 'Executive Family Cottage',
    checkIn: '2026-11-01',
    checkOut: '2026-11-06',
    guestsCount: 4,
    specialRequests: 'Extra bed for child, vegetarian breakfast options.',
    date: '2026-09-02 10:15',
    status: RoomInquiryStatus.IN_PROGRESS,
    internalNotes: 'Checking cottage inventory for Nov 1-6. Confirmed extra bed availability.',
    history: [
      { id: 'h1', timestamp: '2026-09-02 10:15', action: 'Room inquiry submitted by guest' },
      { id: 'h2', timestamp: '2026-09-03 09:00', action: 'Stage updated: New → In Progress', author: 'Reservations Team' }
    ]
  },
  {
    id: 'RM-203',
    guestName: 'Sunil Verma',
    email: 'sunil.verma@outlook.com',
    phone: '+91 98765 43210',
    roomType: 'Heritage Garden Cottage',
    checkIn: '2026-09-20',
    checkOut: '2026-09-22',
    guestsCount: 2,
    specialRequests: 'Early check-in around 10 AM if available.',
    date: '2026-08-29 18:00',
    status: RoomInquiryStatus.CONFIRMED,
    internalNotes: 'Payment link sent and confirmed by front desk.',
    history: [
      { id: 'h1', timestamp: '2026-08-29 18:00', action: 'Room inquiry submitted by guest' },
      { id: 'h2', timestamp: '2026-08-30 11:20', action: 'Stage updated: In Progress → Confirmed', author: 'Front Desk' }
    ]
  },
  {
    id: 'RM-204',
    guestName: 'Liam O\'Connor',
    email: 'liam.oc@irelandtravel.ie',
    phone: '+353 1 496 0123',
    roomType: 'Standard Twin Room',
    checkIn: '2026-10-05',
    checkOut: '2026-10-08',
    guestsCount: 2,
    specialRequests: 'Twin single beds required, quiet garden side room.',
    date: '2026-08-25 14:00',
    status: RoomInquiryStatus.WAITING_FOR_CUSTOMER,
    internalNotes: 'Sent room availability & rate quotation. Awaiting guest confirmation.',
    history: [
      { id: 'h1', timestamp: '2026-08-25 14:00', action: 'Room inquiry submitted by guest' },
      { id: 'h2', timestamp: '2026-08-26 10:00', action: 'Quotation sent to guest email', author: 'Reservations Team' }
    ]
  },
  {
    id: 'RM-205',
    guestName: 'Pooja Karki',
    email: 'pooja.karki@gmail.com',
    phone: '+977 9801122334',
    roomType: 'Deluxe River View Suite',
    checkIn: '2026-08-15',
    checkOut: '2026-08-17',
    guestsCount: 2,
    specialRequests: 'Honeymoon arrangement.',
    date: '2026-08-10 11:30',
    status: RoomInquiryStatus.RESOLVED,
    internalNotes: 'Guest completed stay and left 5-star review.',
    history: [
      { id: 'h1', timestamp: '2026-08-10 11:30', action: 'Room inquiry submitted' },
      { id: 'h2', timestamp: '2026-08-18 10:00', action: 'Stage updated: Confirmed → Resolved', author: 'Manager' }
    ]
  }
];

function notifyUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(INQUIRIES_EVENT));
  }
}

export function normalizeContactStatus(status: any): GeneralContactStatus {
  if (status === 'unread' || status === 'NEW' || status === GeneralContactStatus.NEW) return GeneralContactStatus.NEW;
  if (status === 'IN_PROGRESS' || status === GeneralContactStatus.IN_PROGRESS) return GeneralContactStatus.IN_PROGRESS;
  if (status === 'replied' || status === 'WAITING_FOR_CUSTOMER' || status === GeneralContactStatus.WAITING_FOR_CUSTOMER) return GeneralContactStatus.WAITING_FOR_CUSTOMER;
  if (status === 'RESOLVED' || status === GeneralContactStatus.RESOLVED) return GeneralContactStatus.RESOLVED;
  if (status === 'archived' || status === 'CLOSED' || status === GeneralContactStatus.CLOSED) return GeneralContactStatus.CLOSED;
  return GeneralContactStatus.NEW;
}

export function normalizeRoomInquiryStatus(status: any): RoomInquiryStatus {
  if (status === 'unread' || status === 'NEW' || status === RoomInquiryStatus.NEW) return RoomInquiryStatus.NEW;
  if (status === 'IN_PROGRESS' || status === RoomInquiryStatus.IN_PROGRESS) return RoomInquiryStatus.IN_PROGRESS;
  if (status === 'replied' || status === 'WAITING_FOR_CUSTOMER' || status === RoomInquiryStatus.WAITING_FOR_CUSTOMER) return RoomInquiryStatus.WAITING_FOR_CUSTOMER;
  if (status === 'confirmed' || status === 'CONFIRMED' || status === RoomInquiryStatus.CONFIRMED) return RoomInquiryStatus.CONFIRMED;
  if (status === 'RESOLVED' || status === RoomInquiryStatus.RESOLVED) return RoomInquiryStatus.RESOLVED;
  if (status === 'archived' || status === 'CLOSED' || status === RoomInquiryStatus.CLOSED) return RoomInquiryStatus.CLOSED;
  return RoomInquiryStatus.NEW;
}

export function getGeneralInquiries(): GeneralContactInquiry[] {
  if (typeof window === 'undefined') return initialGeneralInquiries;
  const stored = localStorage.getItem(GENERAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(GENERAL_STORAGE_KEY, JSON.stringify(initialGeneralInquiries));
    return initialGeneralInquiries;
  }
  try {
    const items: any[] = JSON.parse(stored);
    return items.map((item) => ({
      ...item,
      status: normalizeContactStatus(item.status),
      history: item.history || [{ id: 'h1', timestamp: item.date, action: 'Inquiry received' }],
    }));
  } catch {
    return initialGeneralInquiries;
  }
}

export function saveGeneralInquiries(data: GeneralContactInquiry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GENERAL_STORAGE_KEY, JSON.stringify(data));
    notifyUpdate();
  }
}

export function getRoomInquiries(): RoomInquiry[] {
  if (typeof window === 'undefined') return initialRoomInquiries;
  const stored = localStorage.getItem(ROOM_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(initialRoomInquiries));
    return initialRoomInquiries;
  }
  try {
    const items: any[] = JSON.parse(stored);
    return items.map((item) => ({
      ...item,
      status: normalizeRoomInquiryStatus(item.status),
      history: item.history || [{ id: 'h1', timestamp: item.date, action: 'Room inquiry submitted' }],
    }));
  } catch {
    return initialRoomInquiries;
  }
}

export function saveRoomInquiries(data: RoomInquiry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(data));
    notifyUpdate();
  }
}

export function getUnreadCounts() {
  const general = getGeneralInquiries().filter((i) => i.status === GeneralContactStatus.NEW).length;
  const room = getRoomInquiries().filter((i) => i.status === RoomInquiryStatus.NEW).length;
  return {
    general,
    room,
    total: general + room,
  };
}

export { INQUIRIES_EVENT };
