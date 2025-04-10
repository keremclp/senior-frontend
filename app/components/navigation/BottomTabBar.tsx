import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

type TabItem = {
  name: string;
  icon: {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  };
  path: string;
};

const tabs: TabItem[] = [
  {
    name: 'Home',
    icon: {
      active: 'home',
      inactive: 'home-outline',
    },
    path: '/home',
  },
  {
    name: 'Upload CV',
    icon: {
      active: 'document-text',
      inactive: 'document-text-outline',
    },
    path: '/cv/upload',
  },
  {
    name: 'Advisors',
    icon: {
      active: 'people',
      inactive: 'people-outline',
    },
    path: '/advisors',
  },
  {
    name: 'Profile',
    icon: {
      active: 'person',
      inactive: 'person-outline',
    },
    path: '/profile',
  },
];

const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path matches tab path
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <View className="flex-row bg-primary border-t border-dark-200">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.name}
            className="flex-1 py-3 items-center justify-center"
            onPress={() => router.replace(tab.path as any)}
          >
            <Ionicons
              name={active ? tab.icon.active : tab.icon.inactive}
              size={24}
              color={active ? '#60A5FA' : '#D1D5DB'}
            />
            <Text
              className={`text-xs mt-1 ${
                active ? 'text-accent' : 'text-light-300'
              }`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
