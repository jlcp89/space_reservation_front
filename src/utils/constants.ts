export const USER_ROLES = {
  ADMIN: 'admin' as const,
  CLIENT: 'client' as const,
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_RESERVATIONS_PER_WEEK = 3;

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00'
];

export const RESERVATION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TOAST_DURATION = 4000; // 4 seconds

export const API_TIMEOUT = 10000; // 10 seconds