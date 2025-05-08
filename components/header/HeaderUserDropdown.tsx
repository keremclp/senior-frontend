import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Image, Modal, Text, TouchableOpacity, View, Dimensions } from 'react-native';

interface HeaderUserDropdownProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
}

export default function HeaderUserDropdown({ user }: HeaderUserDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  const buttonRef = useRef<TouchableOpacity>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  const handleToggleDropdown = () => {
    if (!showDropdown && buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          // Move dropdown 10px higher by subtracting from top position
          top: pageY + height - 30,
          right: Dimensions.get('window').width - (pageX + width),
        });
        setShowDropdown(true);
      });
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={buttonRef}
        className="flex-row items-center" 
        onPress={handleToggleDropdown}
      >
        <View className="w-8 h-8 bg-white rounded-full mr-2 items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} className="w-full h-full" />
          ) : (
            <Ionicons name="person" size={16} color="#3b82f6" />
          )}
        </View>
        <Ionicons name="chevron-down" size={16} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/20" 
          activeOpacity={1} 
          onPress={() => setShowDropdown(false)}
        >
          <View style={{
            position: 'absolute',
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            overflow: 'hidden'
          }}>
            <View className="p-4 bg-gray-50 border-b border-gray-100">
              <Text className="font-bold">{user?.name}</Text>
              <Text className="text-gray-500 text-sm">{user?.email}</Text>
            </View>
            
            <View>
              <Link href="/profile" asChild>
                <TouchableOpacity 
                  className="p-4 flex-row items-center border-b border-gray-100"
                  onPress={() => setShowDropdown(false)}
                >
                  <Ionicons name="person-outline" size={18} color="#3b82f6" className="mr-2" />
                  <Text className="ml-2">Profile</Text>
                </TouchableOpacity>
              </Link>
              
              <Link href={"/settings" as any} asChild>
                <TouchableOpacity 
                  className="p-4 flex-row items-center border-b border-gray-100"
                  onPress={() => setShowDropdown(false)}
                >
                  <Ionicons name="settings-outline" size={18} color="#3b82f6" className="mr-2" />
                  <Text className="ml-2">Settings</Text>
                </TouchableOpacity>
              </Link>
              
              <TouchableOpacity 
                className="p-4 flex-row items-center"
                onPress={() => {
                  setShowDropdown(false);
                  logout();
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#ef4444" className="mr-2" />
                <Text className="ml-2 text-red-500">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
