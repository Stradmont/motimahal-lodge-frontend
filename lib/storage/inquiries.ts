import { GeneralContactInquiry, RoomInquiry, GeneralContactStatus, RoomInquiryStatus } from '../types/inquiry';

const INQUIRIES_EVENT = 'motimahal_inquiries_updated';

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
  return [];
}

export function saveGeneralInquiries(_data: GeneralContactInquiry[]): void {}

export function getRoomInquiries(): RoomInquiry[] {
  return [];
}

export function saveRoomInquiries(_data: RoomInquiry[]): void {}

export function getUnreadCounts() {
  return {
    general: 0,
    room: 0,
    total: 0,
  };
}

export { INQUIRIES_EVENT };
