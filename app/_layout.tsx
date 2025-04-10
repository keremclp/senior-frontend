import React, { useEffect } from 'react';
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from './context/auth-context';
import './globals.css';

// Root layout with auth provider
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Handle authentication redirects
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public screens (no auth required) */}
      <Stack.Screen name="auth/login" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="auth/register" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="auth/forgot-password" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />

      {/* Protected screens (require auth) */}
      <Stack.Screen 
        name="index"
        options={{ 
          headerShown: false,
        }}
      />
      {/* Additional protected routes would go here */}
    </Stack>
  );
}

// Root layout with providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
