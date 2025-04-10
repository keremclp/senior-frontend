import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { usePathname } from 'expo-router';
import BottomTabBar from './BottomTabBar';

interface AppLayoutProps {
  children: React.ReactNode;
  hideTabBar?: boolean;
}

// Paths where we don't want to show the bottom tab bar
const noTabBarPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/onboarding'
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, hideTabBar }) => {
  const pathname = usePathname();
  
  // Determine if tab bar should be hidden
  const shouldHideTabBar = 
    hideTabBar || 
    noTabBarPaths.some(path => pathname === path || pathname.startsWith(path));
  
  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 0 }}>
      <View className="flex-1">
        {/* Main content area */}
        {children}
      </View>

      {/* Bottom Tab Bar */}
      {!shouldHideTabBar && <BottomTabBar />}
    </SafeAreaView>
  );
};

export default AppLayout;
