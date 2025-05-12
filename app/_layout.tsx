import { AlertProvider } from '@/context/alert-context';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './globals.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add any custom fonts here
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AlertProvider>
        <AuthProvider>
          <ThemeProvider>
            <View style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }} />
            </View>
          </ThemeProvider>
        </AuthProvider>
      </AlertProvider>
    </GestureHandlerRootView>
  );
}
