import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../ui/Button';

const ActionSection = () => {
  const router = useRouter();
  
  const handleUploadResume = () => {
    console.log('Upload Resume button pressed');
    // Alert.alert(
    //   'Coming Soon',
    //   'Resume upload functionality will be available soon!',
    //   [{ text: 'OK' }]
    // );
    router.push('/cv/upload');
  };
  
  const handleViewAdvisors = () => {
    // router.push('/advisors');
  };

  return (
    <View className="px-4 py-6">
      <Text className="text-light-100 text-xl font-semibold mb-4">
        Get Started
      </Text>
      
      <View className="space-y-3">
        <Button 
          title="Upload Your Resume" 
          onPress={handleUploadResume}
          icon="document-text-outline" 
          variant="primary"
        />
        
        <Button 
          title="View Matched Advisors" 
          onPress={handleViewAdvisors}
          icon="people-outline"
          variant="outline"
        />

        <Button 
          title="How It Works"
          onPress={() => router.push('/onboarding')}
          icon="information-circle-outline"
          variant="secondary"
        />
      </View>
    </View>
  );
};

export default ActionSection;