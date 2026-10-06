# VKU Study Room Booking App

A high-performance React Native & Expo application for campus study room reservations. Built for VKU students to check real-time availability and reserve computer labs and study rooms.

## Features

*   **Room Discovery & Multi-Parameter Filter:** High-performance `FlatList` feed displaying rooms. Instant search and filter by building, capacity, and equipment.
*   **Interactive Time-Slot Selector:** 7-day date selector with 2-hour discrete time slots. Visual conflict prevention (already-booked slots are disabled).
*   **Booking Pass:** Generates a unique booking pass with an interactive QR check-in modal.
*   **Global State Management:** Uses Zustand for managing user sessions, active reservations, and active filters. Data is persisted using `AsyncStorage`.
*   **Local Notifications:** Integrates `expo-notifications` to trigger a check-in alert 15 minutes before the booked slot starts.

## Tech Stack

*   React Native
*   Expo SDK
*   TypeScript
*   Zustand (State Management)
*   React Navigation (Bottom Tabs & Native Stack)
*   AsyncStorage (Persistence)

## Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the App:**
    ```bash
    npm run start
    ```
    or for specific platforms:
    ```bash
    npm run android
    npm run ios
    ```

## Architecture Overview

The app follows a modular architecture:
*   `src/components/`: Reusable UI components (SearchBar, FilterChips, RoomCard, etc.).
*   `src/constants/`: Theme definitions (colors, typography, spacing).
*   `src/data/`: Mock data for rooms.
*   `src/navigation/`: App routing and navigation structure.
*   `src/screens/`: Main application screens (Home, RoomDetail, Booking, MyBookings, Profile).
*   `src/services/`: External services (Notifications).
*   `src/store/`: Zustand global state management.
*   `src/types/`: TypeScript interfaces and types.
*   `src/utils/`: Helper functions.
