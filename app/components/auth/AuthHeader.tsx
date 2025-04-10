import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  showBackButton = true
}) => {
  const router = useRouter();

  return (
    <View className="py-4">
      <View className="flex-row items-center mb-6">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 rounded-full bg-dark-100 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#F3F4F6" />
          </TouchableOpacity>
        )}
        <Text className="text-light-100 text-2xl font-bold">{title}</Text>
      </View>
    </View>
  );
};

export default AuthHeader;
