import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
}) => {
  const router = useRouter();

  return (
    <View className="bg-primary pt-12 pb-4 px-4">
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 rounded-full bg-dark-100 p-2"
              style={styles.iconButton}
            >
              <Ionicons name="arrow-back" size={20} color="#F3F4F6" />
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-light-100 text-xl font-bold">{title}</Text>
            {subtitle && <Text className="text-light-300 text-sm mt-1">{subtitle}</Text>}
          </View>
        </View>

        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            className="rounded-full bg-dark-100 p-2"
            style={styles.iconButton}
          >
            <Ionicons name={rightAction.icon} size={20} color="#F3F4F6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
