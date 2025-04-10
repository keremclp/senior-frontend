import React from 'react';
import { View, Text } from 'react-native';

type StatItemProps = {
  label: string;
  value: string | number;
};

const StatItem = ({ label, value }: StatItemProps) => (
  <View className="bg-dark-100 rounded-xl p-4 flex-1">
    <Text className="text-light-300 text-sm">{label}</Text>
    <Text className="text-light-100 text-xl font-bold mt-1">{value}</Text>
  </View>
);

const StatsSection = () => {
  return (
    <View className="px-4 py-3">
      <Text className="text-light-100 text-xl font-semibold mb-3">
        Your Matching Stats
      </Text>
      
      <View className="flex-row space-x-4">
        <StatItem label="Matched Advisors" value="0" />
        <StatItem label="Match Accuracy" value="--" />
      </View>
    </View>
  );
};

export default StatsSection;
