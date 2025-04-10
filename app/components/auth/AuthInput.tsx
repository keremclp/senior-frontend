import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  secureTextEntry?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  error,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View className="mb-4">
      <Text className="text-light-100 text-sm mb-2">{label}</Text>
      
      <View 
        className={`flex-row items-center bg-dark-100 rounded-xl px-4 py-3 border ${
          error ? 'border-red-500' : isFocused ? 'border-accent' : 'border-transparent'
        }`}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={error ? '#ef4444' : isFocused ? '#60A5FA' : '#D1D5DB'} 
          style={{ marginRight: 10 }}
        />
        
        <TextInput
          className="flex-1 text-light-100 text-base"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setHidePassword(!hidePassword)}
            className="p-2"
          >
            <Ionicons 
              name={hidePassword ? 'eye-outline' : 'eye-off-outline'} 
              size={20} 
              color="#9CA3AF" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};

export default AuthInput;
