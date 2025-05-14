import { authApi } from "@/lib/api/auth";
import { validateEmail } from "@/lib/utils/validation";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleValidateEmail = () => {
    const error = validateEmail(email);
    setEmailError(error);
    return !error;
  };
  
  const handleForgotPassword = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const isEmailValid = handleValidateEmail();
    
    if (!isEmailValid) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to process your request. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(auth)/login");
  };
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#1E3A8A', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full py-10 px-6 rounded-b-3xl"
          style={styles.gradientHeader}
        >
          <View className="items-center">
            <View className="bg-white/20 w-28 h-28 rounded-full items-center justify-center mb-4">
              <Image 
                source={require('@/assets/images/logo.png')} 
                className="w-24 h-24 rounded-full"
                style={{ resizeMode: 'contain' }}
              />
            </View>
            <Text className="text-2xl font-bold text-white">Forgot Password</Text>
            <Text className="text-white/80 text-center mt-1">We'll help you reset it</Text>
          </View>
        </LinearGradient>
        
        {/* Form Card */}
        <Animated.View 
          className="px-6"
          entering={FadeInDown.duration(700).springify()}
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg -mt-8" style={styles.formCard}>
            {!isSuccess ? (
              <>
                <Text className="text-xl font-bold text-gray-800 mb-2">Reset Your Password</Text>
                <Text className="text-gray-500 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </Text>
                
                <View className="space-y-6">
                  {/* Email Input */}
                  <View>
                    <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Email</Text>
                    <View className="flex-row items-center">
                      <View className="absolute z-10 h-full justify-center pl-3">
                        <Ionicons name="mail-outline" size={18} color="#6B7280" />
                      </View>
                      <TextInput
                        className={`border rounded-xl p-4 pl-10 bg-white flex-1 ${emailError ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={handleValidateEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                      />
                    </View>
                    {emailError ? <Text className="text-red-500 text-sm mt-1.5 ml-1">{emailError}</Text> : null}
                  </View>
                  
                  {/* Error message */}
                  {error ? (
                    <View className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <View className="flex-row items-center">
                        <Ionicons name="alert-circle" size={18} color="#EF4444" />
                        <Text className="text-red-500 font-medium ml-2">{error}</Text>
                      </View>
                    </View>
                  ) : null}
                  
                  {/* Submit button */}
                  <TouchableOpacity
                    className={`py-4 rounded-xl mt-2 ${isLoading ? 'bg-blue-400' : 'bg-primary'}`}
                    onPress={handleForgotPassword}
                    disabled={isLoading}
                    style={styles.submitButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">Send Reset Link</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
                  <Ionicons name="checkmark" size={32} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Check Your Email</Text>
                <Text className="text-gray-500 mb-6 text-center">
                  We've sent a password reset link to {email}
                </Text>
                <TouchableOpacity
                  className="py-4 px-6 rounded-xl bg-primary w-full"
                  onPress={handleBackToLogin}
                  style={styles.submitButton}
                >
                  <Text className="text-white text-center font-semibold text-lg">Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Back to login link */}
            {!isSuccess && (
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Remember your password? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Text className="text-primary font-semibold">Log in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>
        </Animated.View>
        
        {/* Footer */}
        <View className="mt-6 mb-8 items-center">
          <Text className="text-gray-500 text-sm">© {new Date().getFullYear()} ResumeMatch. All rights reserved.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  gradientHeader: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  formCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    fontSize: 16,
  },
  submitButton: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }
});
