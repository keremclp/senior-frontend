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
      
      {/* Home screen */}
      <Stack.Screen 
        name="home/index"
        options={{ 
          headerShown: false,
          animation: 'fade',
        }}
      />
      
      {/* CV Upload Module */}
      <Stack.Screen name="cv/upload" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="cv/review" options={{ animation: 'slide_from_right' }} />
      
      {/* Advisor Matching Module */}
      <Stack.Screen name="advisors/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="advisors/[id]" options={{ animation: 'slide_from_right' }} />
      
      {/* Feedback Module */}
      <Stack.Screen name="feedback/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="feedback/thank-you" options={{ animation: 'slide_from_bottom' }} />
      
      {/* User profile */}
      <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
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
