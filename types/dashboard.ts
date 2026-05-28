// ─── Shared dashboard types ──────────────────────────────────────────────────

export type DashboardRole = 'admin' | 'kitchen' | 'guest';

export type AdminTab   = 'bookings' | 'rooms' | 'orders' | 'reports';
export type KitchenTab = 'queue' | 'completed';
export type GuestTab   = 'stay' | 'orderFood' | 'requests' | 'orders';
