import { useAuth } from "@/context/auth-context";
import { getPasswordStrength, getStrengthColor, getStrengthText, validateConfirmPassword, validateEmail, validateName, validatePassword } from "@/lib/utils/validation";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  
  const { register, isLoading, error } = useAuth();
  
  // Validation handlers
  const handleValidateName = () => {
    const error = validateName(name);
    setNameError(error);
    return !error;
  };
  
  const handleValidateEmail = () => {
    const error = validateEmail(email);
    setEmailError(error);
    return !error;
  };
  
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
  
  const handleRegister = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Validate all fields
    const isNameValid = handleValidateName();
    const isEmailValid = handleValidateEmail();
    const isPasswordValid = handleValidatePassword();
    const isConfirmPasswordValid = handleValidateConfirmPassword();
    
    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      await register({ 
        name, 
        email, 
        password
      });
    }
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#1E3A8A', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full py-8 px-6 rounded-b-3xl"
          style={styles.gradientHeader}
        >
          <View className="items-center">
            <View className="bg-white/20 w-28 h-28 rounded-full items-center justify-center mb-3">
              <Image 
                source={require('@/assets/images/logo.png')} 
                className="w-24 h-24 rounded-full"
                style={{ resizeMode: 'contain' }}
              />
            </View>
            <Text className="text-2xl font-bold text-white">Join ResumeMatch</Text>
            <Text className="text-white/80 text-center mt-1">Create your account today</Text>
          </View>
        </LinearGradient>
        
        {/* Sign Up Form Card */}
        <Animated.View 
          className="px-6"
          entering={FadeInDown.duration(700).springify()}
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg -mt-6" style={styles.formCard}>
            <Text className="text-2xl font-bold text-gray-800 mb-6">Create Account</Text>
            
            <View className="space-y-5">
              {/* Name Input */}
              <View>
                <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Full Name</Text>
                <View className="flex-row items-center">
                  <View className="absolute z-10 h-full justify-center pl-3">
                    <Ionicons name="person-outline" size={18} color="#6B7280" />
                  </View>
                  <TextInput
                    className={`border rounded-xl p-4 pl-10 bg-white flex-1 ${nameError ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    onBlur={handleValidateName}
                    style={styles.input}
                  />
                </View>
                {nameError ? <Text className="text-red-500 text-sm mt-1.5 ml-1">{nameError}</Text> : null}
              </View>
              
              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Email Address</Text>
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
              
              {/* Register button */}
              <TouchableOpacity
                className={`py-4 rounded-xl mt-2 ${isLoading ? 'bg-blue-400' : 'bg-primary'}`}
                onPress={handleRegister}
                disabled={isLoading}
                style={styles.registerButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
                )}
              </TouchableOpacity>
              
              {/* Login link */}
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600">Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Text className="text-primary font-semibold">Log in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </Animated.View>
        
        {/* Footer */}
        <View className="mt-6 mb-8 items-center">
          <Text className="text-gray-500 text-xs">By signing up, you agree to our Terms & Privacy Policy</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
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
  registerButton: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }
});