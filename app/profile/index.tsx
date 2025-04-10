import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Redirect } from "expo-router";
import { useAuth } from '../context/auth-context';
import Header from '../components/ui/Header';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  
  // Show loading state or redirect if not authenticated
  if (isLoading) return null;
  if (!user) return <Redirect href="/auth/login" />;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Logout', 
          onPress: () => logout(),
          style: 'destructive'
        }
      ]
    );
  };

  type ProfileMenuItemProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
    color?: string;
  };

  const ProfileMenuItem = ({ icon, label, onPress, color = "#F3F4F6" }: ProfileMenuItemProps) => (
    <TouchableOpacity 
      className="flex-row items-center p-4 bg-dark-100 rounded-lg mb-2"
      onPress={onPress}
    >
      <View className="w-8 h-8 rounded-full bg-dark-200 items-center justify-center mr-4">
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text className="text-light-100 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 0 }}>
      <Header title="Profile" />
      
      <ScrollView className="flex-1 px-4">
        {/* Profile Header */}
        <View className="items-center py-6">
          <View className="w-20 h-20 rounded-full bg-dark-100 items-center justify-center mb-3">
            <Text className="text-light-100 text-3xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-light-100 text-xl font-bold">{user.name}</Text>
          <Text className="text-light-300">{user.email}</Text>
        </View>
        
        {/* Settings Menu */}
        <View className="mt-4">
          <Text className="text-light-100 text-lg font-semibold mb-2">Account</Text>
          
          <ProfileMenuItem 
            icon="person-outline" 
            label="Edit Profile" 
            onPress={() => Alert.alert("Coming Soon", "This feature will be available soon.")}
          />
          
          <ProfileMenuItem 
            icon="document-text-outline" 
            label="My Resume" 
            onPress={() => Alert.alert("Coming Soon", "This feature will be available soon.")}
          />
          
          <Text className="text-light-100 text-lg font-semibold mb-2 mt-6">Settings</Text>
          
          <ProfileMenuItem 
            icon="notifications-outline" 
            label="Notifications" 
            onPress={() => Alert.alert("Coming Soon", "This feature will be available soon.")}
          />
          
          <ProfileMenuItem 
            icon="shield-outline" 
            label="Privacy & Security" 
            onPress={() => Alert.alert("Coming Soon", "This feature will be available soon.")}
          />
          
          <ProfileMenuItem 
            icon="help-circle-outline" 
            label="Help & Support" 
            onPress={() => Alert.alert("Coming Soon", "This feature will be available soon.")}
          />
          
          <ProfileMenuItem 
            icon="log-out-outline" 
            label="Logout" 
            onPress={handleLogout}
            color="#ef4444"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
