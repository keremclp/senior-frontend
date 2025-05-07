import { useAuth } from "@/context/auth-context";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <View className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">My Profile</Text>
          
          <View className="space-y-3 mb-6">
            <View>
              <Text className="text-gray-500 text-sm">Name</Text>
              <Text className="text-gray-800 font-medium">{user?.name}</Text>
            </View>
            
            <View>
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-gray-800 font-medium">{user?.email}</Text>
            </View>
            
            {user?.university && (
              <View>
                <Text className="text-gray-500 text-sm">University</Text>
                <Text className="text-gray-800 font-medium">{user.university}</Text>
              </View>
            )}
            
            {user?.engineeringField && (
              <View>
                <Text className="text-gray-500 text-sm">Field of Engineering</Text>
                <Text className="text-gray-800 font-medium">{user.engineeringField}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            className="bg-gray-100 py-3 px-4 rounded-lg mb-4"
            onPress={() => {
              // Edit profile functionality will go here
              Alert.alert("Coming soon", "Edit profile functionality will be available in a future update.");
            }}
          >
            <Text className="text-center text-gray-800 font-medium">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-50 py-3 px-4 rounded-lg"
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <Text className="text-center text-red-500 font-medium">Log Out</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View className="bg-white rounded-lg shadow-sm p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">App Settings</Text>
          
          <TouchableOpacity
            className="py-3 border-b border-gray-100"
            onPress={() => {
              Alert.alert("Coming soon", "Notification settings will be available in a future update.");
            }}
          >
            <Text className="text-gray-800">Notification Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="py-3 border-b border-gray-100"
            onPress={() => {
              Alert.alert("Coming soon", "Privacy settings will be available in a future update.");
            }}
          >
            <Text className="text-gray-800">Privacy Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="py-3"
            onPress={() => {
              Alert.alert("App Info", "Resume-Advisor Matching App\nVersion 1.0.0");
            }}
          >
            <Text className="text-gray-800">About</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
