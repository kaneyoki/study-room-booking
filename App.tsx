import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermissions } from './src/services/notificationService';
import { useBookingStore } from './src/store/useBookingStore';

export default function App() {
  const { login, user } = useBookingStore();

  useEffect(() => {
    // Request notification permissions on mount
    requestNotificationPermissions();

    // Auto-login a mock user for demo purposes if not logged in
    if (!user) {
      login({
        id: 'user-1',
        name: 'Nguyễn Văn A',
        studentId: '21IT123',
        email: 'nva.21it@vku.udn.vn',
      });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
