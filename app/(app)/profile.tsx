import { useAlert } from '@/context/alert-context';
import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const { showAlert } = useAlert();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    showAlert({
      type: 'warning',
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      showConfirm: true,
      confirmText: 'Log Out',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setLoggingOut(true);
        try {
          await logout();
        } finally {
          setLoggingOut(false);
        }
      }
    });
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Profile Card */}
        <View style={styles.card} className="bg-white rounded-xl p-6 mb-6">
          <View className="flex-row items-center mb-6">
            <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center mr-4">
              <Ionicons name="person" size={24} color="#1E3A8A" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">My Profile</Text>
          </View>
          
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center">
              <View className="w-8 items-center mr-3">
                <Ionicons name="person-outline" size={18} color="#6B7280" />
              </View>
              <View>
                <Text className="text-gray-500 text-sm">Name</Text>
                <Text className="text-gray-800 font-medium text-base">{user?.name}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 items-center mr-3">
                <Ionicons name="mail-outline" size={18} color="#6B7280" />
              </View>
              <View>
                <Text className="text-gray-500 text-sm">Email</Text>
                <Text className="text-gray-800 font-medium text-base">{user?.email}</Text>
              </View>
            </View>
            
            {user?.university && (
              <View className="flex-row items-center">
                <View className="w-8 items-center mr-3">
                  <Ionicons name="school-outline" size={18} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">University</Text>
                  <Text className="text-gray-800 font-medium text-base">{user.university}</Text>
                </View>
              </View>
            )}
            
            {user?.engineeringField && (
              <View className="flex-row items-center">
                <View className="w-8 items-center mr-3">
                  <Ionicons name="construct-outline" size={18} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Field of Engineering</Text>
                  <Text className="text-gray-800 font-medium text-base">{user.engineeringField}</Text>
                </View>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.buttonPrimary}
            className="bg-blue-50 py-3 px-4 rounded-lg mb-4 flex-row items-center justify-center"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Coming soon", "Edit profile functionality will be available in a future update.");
            }}
          >
            <Ionicons name="create-outline" size={18} color="#2563EB" />
            <Text className="text-center text-blue-600 font-medium ml-2">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.buttonDanger}
            className="bg-red-50 py-3 px-4 rounded-lg flex-row items-center justify-center"
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="text-center text-red-500 font-medium ml-2">Log Out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Settings Card */}
        <View style={styles.card} className="bg-white rounded-xl p-6">
          <View className="flex-row items-center mb-6">
            <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mr-4">
              <Ionicons name="settings-outline" size={20} color="#4B5563" />
            </View>
            <Text className="text-xl font-bold text-gray-800">App Settings</Text>
          </View>
          
          <TouchableOpacity
            className="flex-row items-center py-3.5 border-b border-gray-100"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Coming soon", "Notification settings will be available in a future update.");
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-gray-700 flex-1">Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-row items-center py-3.5 border-b border-gray-100"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Coming soon", "Privacy settings will be available in a future update.");
            }}
          >
            <Ionicons name="shield-outline" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-gray-700 flex-1">Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-row items-center py-3.5"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("App Info", "Resume-Advisor Matching App\nVersion 1.0.0");
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-gray-700 flex-1">About</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  buttonPrimary: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonDanger: {
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  }
});
