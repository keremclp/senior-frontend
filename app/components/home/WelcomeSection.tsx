import React from 'react';
import { View, Text, Image } from 'react-native';

type WelcomeSectionProps = {
  userName?: string;
};

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <View className="px-4 pt-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-light-300 text-base">Welcome{userName ? `, ${userName}` : ''}</Text>
          <Text className="text-light-100 text-2xl font-bold mt-1">Find Your Perfect Advisor</Text>
        </View>
        <View className="h-12 w-12 rounded-full bg-dark-100 items-center justify-center">
          {/* Profile image placeholder - replace with actual image component when available */}
          <Text className="text-light-100 text-lg font-bold">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      </View>
      
      <View className="mt-6 bg-dark-100 rounded-2xl p-4">
        <Text className="text-light-100 text-base font-medium">How it works</Text>
        <Text className="text-light-300 text-sm mt-2">
          Upload your resume, and our AI will match you with academic advisors 
          who align with your interests, skills, and career goals.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeSection;
