import { useAuth } from "@/context/auth-context";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // If user is not authenticated, redirect to login
      router.replace('/(auth)/login' as any);
    }
  }, [isAuthenticated, isLoading]);

  // If still loading auth state, don't render anything yet
  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E3A8A', // primary color
        tabBarInactiveTintColor: '#4B5563', // gray-600
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB', // gray-200
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#F9FAFB', // gray-50
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerTitle: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="resume"
        options={{
          title: "Resumes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" size={size} color={color} />
          ),
          headerTitle: "My Resumes",
        }}
      />
      <Tabs.Screen 
        name="resume/upload" 
        options={{
          title: "Upload Resume",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="upload" size={size} color={color} />
          ),
          headerTitle: "Upload Resume",
        }}
      />
      <Tabs.Screen
        name="matching"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
          headerTitle: "Advisor Matches",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          headerTitle: "My Profile",
        }}
      />
    </Tabs>
  );
}
