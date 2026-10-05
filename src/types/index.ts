// ============================================================
// Type Definitions for VKU Study Room Booking App
// ============================================================

export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  description: string;
  image: string; // URI or require() path
  rating: number; // 1-5
}

export interface TimeSlot {
  id: number;
  label: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  userId: string;
  userName: string;
  date: string;       // "YYYY-MM-DD"
  timeSlotId: number;
  timeSlotLabel: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;   // ISO string
  qrCode: string;      // Unique booking pass code
  purpose?: string;
  groupSize?: number;
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  avatar?: string;
}

export interface Filters {
  buildings: Building[];
  minCapacity: number;
  maxCapacity: number;
  equipment: Equipment[];
  status: RoomStatus | 'all';
}

export interface BookingState {
  // User session
  user: User | null;
  isLoggedIn: boolean;

  // Rooms
  rooms: Room[];

  // Bookings
  bookings: Booking[];

  // Filters & Search
  filters: Filters;
  searchQuery: string;

  // Actions - User
  login: (user: User) => void;
  logout: () => void;

  // Actions - Bookings
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'qrCode' | 'status'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  getBookingsForRoom: (roomId: string, date: string) => Booking[];
  isSlotBooked: (roomId: string, date: string, timeSlotId: number) => boolean;
  getActiveBookings: () => Booking[];
  getPastBookings: () => Booking[];

  // Actions - Filters
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  getFilteredRooms: () => Room[];
}
