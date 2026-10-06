// ============================================================
// Zustand Store - Global Booking State Management
// With AsyncStorage Persistence
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingState, Booking, User, Filters, Room } from '../types';
import { ROOMS_DATA } from '../data/rooms';
import { generateId, generateQRCode } from '../utils/helpers';

const DEFAULT_FILTERS: Filters = {
  buildings: [],
  minCapacity: 2,
  maxCapacity: 20,
  equipment: [],
  status: 'all',
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────
      user: null,
      isLoggedIn: false,
      rooms: ROOMS_DATA,
      bookings: [],
      filters: DEFAULT_FILTERS,
      searchQuery: '',

      // ── User Actions ───────────────────────────────
      login: (user: User) => {
        set({ user, isLoggedIn: true });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      // ── Booking Actions ────────────────────────────
      addBooking: (bookingData) => {
        const id = generateId();
        const newBooking: Booking = {
          ...bookingData,
          id,
          status: 'active',
          createdAt: new Date().toISOString(),
          qrCode: generateQRCode(id, bookingData.roomId, bookingData.date),
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));

        return newBooking;
      },

      cancelBooking: (bookingId: string) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        }));
      },

      getBookingsForRoom: (roomId: string, date: string) => {
        return get().bookings.filter(
          (b) => b.roomId === roomId && b.date === date && b.status === 'active'
        );
      },

      isSlotBooked: (roomId: string, date: string, timeSlotId: number) => {
        return get().bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.timeSlotId === timeSlotId &&
            b.status === 'active'
        );
      },

      getActiveBookings: () => {
        const today = new Date().toISOString().split('T')[0];
        return get()
          .bookings.filter(
            (b) => b.status === 'active' && b.date >= today
          )
          .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.timeSlotId - b.timeSlotId;
          });
      },

      getPastBookings: () => {
        const today = new Date().toISOString().split('T')[0];
        return get()
          .bookings.filter(
            (b) => b.status !== 'active' || b.date < today
          )
          .sort((a, b) => b.date.localeCompare(a.date));
      },

      // ── Filter Actions ─────────────────────────────
      setFilters: (newFilters: Partial<Filters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS, searchQuery: '' });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredRooms: () => {
        const { rooms, filters, searchQuery, bookings } = get();
        let filtered = [...rooms];

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.building.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q)
          );
        }

        // Filter by building
        if (filters.buildings.length > 0) {
          filtered = filtered.filter((r) =>
            filters.buildings.includes(r.building)
          );
        }

        // Filter by capacity
        filtered = filtered.filter(
          (r) =>
            r.capacity >= filters.minCapacity &&
            r.capacity <= filters.maxCapacity
        );

        // Filter by equipment
        if (filters.equipment.length > 0) {
          filtered = filtered.filter((r) =>
            filters.equipment.every((eq) => r.equipment.includes(eq))
          );
        }

        // Filter by status (availability today)
        if (filters.status !== 'all') {
          const today = new Date().toISOString().split('T')[0];
          if (filters.status === 'available') {
            filtered = filtered.filter((r) => {
              const roomBookings = bookings.filter(
                (b) =>
                  b.roomId === r.id &&
                  b.date === today &&
                  b.status === 'active'
              );
              return roomBookings.length < 4; // Less than all 4 slots booked
            });
          }
        }

        return filtered;
      },
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        bookings: state.bookings,
      }),
    }
  )
);
