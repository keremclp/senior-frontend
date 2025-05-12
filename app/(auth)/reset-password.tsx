import { authApi } from "@/lib/api/auth";
import { getPasswordStrength, getStrengthColor, getStrengthText, validateConfirmPassword, validatePassword } from "@/lib/utils/validation";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleValidatePassword = () => {
    const error = validatePassword(password, true);
    setPasswordError(error);
    return !error;
  };
  
  const handleValidateConfirmPassword = () => {
    const error = validateConfirmPassword(password, confirmPassword);
    setConfirmPasswordError(error);
    return !error;
  };
  
  const handleResetPassword = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const isPasswordValid = handleValidatePassword();
    const isConfirmPasswordValid = handleValidateConfirmPassword();
    
    if (!isPasswordValid || !isConfirmPasswordValid) return;
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await authApi.resetPassword(token, password);
      setIsSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to reset password. The token may be invalid or expired.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(auth)/login");
  };
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  if (!token) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <View className="bg-red-50 p-6 rounded-xl border border-red-100 w-full items-center">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-800 mt-4 mb-2 text-center">Invalid Reset Link</Text>
          <Text className="text-gray-500 mb-6 text-center">
            The password reset link is invalid or has expired. Please request a new one.
          </Text>
          <TouchableOpacity
            className="py-4 px-6 rounded-xl bg-primary w-full"
            onPress={() => router.replace("/(auth)/forgot-password")}
            style={styles.submitButton}
          >
            <Text className="text-white text-center font-semibold text-lg">Request New Reset Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
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
            <View className="bg-white/20 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Image 
                source={require('@/assets/images/react-logo.png')} 
                className="w-12 h-12"
                style={{ resizeMode: 'contain' }}
              />
            </View>
            <Text className="text-2xl font-bold text-white">Reset Password</Text>
            <Text className="text-white/80 text-center mt-1">Create a new secure password</Text>
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
                <Text className="text-xl font-bold text-gray-800 mb-2">Create New Password</Text>
                <Text className="text-gray-500 mb-6">
                  Your new password must be different from previous passwords.
                </Text>
                
                <View className="space-y-6">
                  {/* Password Input */}
                  <View>
                    <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Password</Text>
                    <View className="flex-row items-center">
                      <View className="absolute z-10 h-full justify-center pl-3">
                        <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                      </View>
                      <TextInput
                        className={`border rounded-xl p-4 pl-10 pr-10 bg-white flex-1 ${passwordError ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Create a password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        onBlur={handleValidatePassword}
                        secureTextEntry={secureTextEntry}
                        style={styles.input}
                      />
                      <TouchableOpacity 
                        className="absolute right-0 h-full justify-center pr-3.5"
                        onPress={toggleSecureEntry}
                      >
                        <Ionicons 
                          name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                          size={20} 
                          color="#6B7280" 
                        />
                      </TouchableOpacity>
                    </View>
                    {passwordError ? (
                      <Text className="text-red-500 text-sm mt-1.5 ml-1">{passwordError}</Text>
                    ) : password ? (
                      <View className="mt-2 px-1">
                        <View className="flex-row items-center justify-between mb-1.5">
                          <Text className="text-sm text-gray-600">Password Strength:</Text>
                          <View className={`px-2 py-0.5 rounded-md ${
                            passwordStrength < 3 ? 'bg-red-100' : 
                            passwordStrength < 4 ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            <Text className={`text-sm font-medium ${
                              passwordStrength < 3 ? 'text-red-600' : 
                              passwordStrength < 4 ? 'text-yellow-700' : 'text-green-600'
                            }`}>
                              {getStrengthText(passwordStrength)}
                            </Text>
                          </View>
                        </View>
                        <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <View 
                            className={`h-2 rounded-full ${getStrengthColor(passwordStrength)}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                  
                  {/* Confirm Password Input */}
                  <View>
                    <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Confirm Password</Text>
                    <View className="flex-row items-center">
                      <View className="absolute z-10 h-full justify-center pl-3">
                        <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
                      </View>
                      <TextInput
                        className={`border rounded-xl p-4 pl-10 pr-10 bg-white flex-1 ${confirmPasswordError ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9CA3AF"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onBlur={handleValidateConfirmPassword}
                        secureTextEntry={secureConfirmTextEntry}
                        style={styles.input}
                      />
                      <TouchableOpacity 
                        className="absolute right-0 h-full justify-center pr-3.5"
                        onPress={toggleSecureConfirmEntry}
                      >
                        <Ionicons 
                          name={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"} 
                          size={20} 
                          color="#6B7280" 
                        />
                      </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? <Text className="text-red-500 text-sm mt-1.5 ml-1">{confirmPasswordError}</Text> : null}
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
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    style={styles.submitButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">Reset Password</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
                  <Ionicons name="checkmark" size={32} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Password Reset Successful</Text>
                <Text className="text-gray-500 mb-6 text-center">
                  Your password has been reset successfully. Please log in with your new password.
                </Text>
                <TouchableOpacity
                  className="py-4 px-6 rounded-xl bg-primary w-full"
                  onPress={handleGoToLogin}
                  style={styles.submitButton}
                >
                  <Text className="text-white text-center font-semibold text-lg">Go to Login</Text>
                </TouchableOpacity>
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
