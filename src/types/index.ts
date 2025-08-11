// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Core Entity Types
export interface Person {
  id: number;
  email: string;
  role: 'admin' | 'client';
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  personId: number;
  spaceId: number;
  reservationDate: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  createdAt: string;
  updatedAt: string;
  person?: {
    id: number;
    email: string;
    role: string;
  };
  space?: {
    id: number;
    name: string;
    location: string;
    capacity: number;
  };
}

// Form Types
export interface PersonFormData {
  email: string;
  role: 'admin' | 'client';
}

export interface SpaceFormData {
  name: string;
  location: string;
  capacity: number;
  description?: string;
}

export interface ReservationFormData {
  personId: number | string;
  spaceId: number | string;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}