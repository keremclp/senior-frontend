import { AuthProvider } from "@/context/auth-context";
import { Stack } from "expo-router";
import './globals.css';

// Root layout wrapper that includes providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Navigation structure based on auth state
function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
