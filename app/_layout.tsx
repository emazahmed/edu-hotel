import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { BookingProvider } from '@/contexts/BookingContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <BookingProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </BookingProvider>
    </AuthProvider>
  );
}