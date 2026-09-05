export enum GeneralContactStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum RoomInquiryStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  CONFIRMED = 'CONFIRMED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface ContactActivityLog {
  id: string;
  timestamp: string;
  action: string;
  author?: string;
}

export interface GeneralContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: GeneralContactStatus;
  category: string;
  isUrgent?: boolean;
  internalNotes?: string;
  history?: ContactActivityLog[];
}

export interface RoomInquiry {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  specialRequests: string;
  date: string;
  status: RoomInquiryStatus;
  isUrgent?: boolean;
  internalNotes?: string;
  history?: ContactActivityLog[];
}
