import React, { useState } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import AuthHeader from '../components/auth/AuthHeader';
import AuthInput from '../components/auth/AuthInput';
import Button from '../components/ui/Button';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to process your request. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-4">
          <AuthHeader title="Reset Password" />
          
          {isSubmitted ? (
            <View className="mt-12 items-center">
              <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-6">
                <Text className="text-white text-2xl">✓</Text>
              </View>
              
              <Text className="text-light-100 text-xl font-bold mb-4">
                Check Your Email
              </Text>
              
              <Text className="text-light-300 text-center mb-8">
                We've sent password reset instructions to {email}
              </Text>
              
              <Button
                title="Back to Login"
                onPress={() => router.push('/auth/login')}
                icon="arrow-back"
                variant="secondary"
              />
            </View>
          ) : (
            <View className="mt-6">
              <Text className="text-light-300 text-base mb-6">
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              
              <AuthInput
                label="Email Address"
                icon="mail-outline"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={error}
              />
              
              <View className="mt-6">
                <Button
                  title="Send Reset Instructions"
                  onPress={handleResetPassword}
                  loading={isLoading}
                  disabled={isLoading}
                  icon="send-outline"
                  variant="primary"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
