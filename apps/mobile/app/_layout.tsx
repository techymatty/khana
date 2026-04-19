import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const loadToken = useAuthStore((s) => s.loadToken);

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="restaurant/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            headerShown: true,
            headerTitle: 'Your Cart',
            headerTintColor: '#000',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            headerTitle: 'Checkout',
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen
          name="tracking/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Order Tracking',
            headerTintColor: '#000',
          }}
        />
      </Stack>
    </>
  );
}
