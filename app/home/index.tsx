import React from 'react';
import { ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Redirect } from "expo-router";
import { useAuth } from '../context/auth-context';
import WelcomeSection from '../components/home/WelcomeSection';
import StatsSection from '../components/home/StatsSection';
import ActionSection from '../components/home/ActionSection';

export default function Home() {
  const { user, isLoading } = useAuth();
  
  // Show loading state or redirect if not authenticated
  if (isLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;
  
  // Your authenticated home page component
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <WelcomeSection userName={user.name} />
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Action Section */}
        <ActionSection />
      </ScrollView>
    </SafeAreaView>
  );
}
