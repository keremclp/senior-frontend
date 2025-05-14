import { useAuth } from "@/context/auth-context";
import { validateEmail, validatePassword } from "@/lib/utils/validation";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const { login, isLoading, error } = useAuth();
  
  const handleValidateEmail = () => {
    const error = validateEmail(email);
    setEmailError(error);
    return !error;
  };
  
  const handleValidatePassword = () => {
    const error = validatePassword(password);
    setPasswordError(error);
    return !error;
  };
  
  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const isEmailValid = handleValidateEmail();
    const isPasswordValid = handleValidatePassword();
    
    if (isEmailValid && isPasswordValid) {
      await login({ email, password });
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          className="w-full py-12 px-6 rounded-b-3xl"
          style={styles.gradientHeader}
        >
          <View className="items-center">
            <View className="bg-white/20 w-28 h-28 rounded-full items-center justify-center mb-4">
              <Image 
                source={require('@/assets/images/logo.png')} 
                className="w-24 h-24  rounded-full" 
                style={{ resizeMode: 'contain' }}
              />
            </View>
            <Text className="text-3xl font-bold text-white">ResumeMatch</Text>
            <Text className="text-white/80 text-center mt-1">Find your perfect advisor</Text>
          </View>
        </LinearGradient>
        
        {/* Login Form Card */}
        <Animated.View 
          className="px-6 mt-0"
          entering={FadeInDown.duration(700).springify()}
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg -mt-8" style={styles.formCard}>
            <Text className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</Text>
            
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
              
              {/* Password Input */}
              <View>
                <Text className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Password</Text>
                <View className="flex-row items-center">
                  <View className="absolute z-10 h-full justify-center pl-3">
                    <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                  </View>
                  <TextInput
                    className={`border rounded-xl p-4 pl-10 pr-10 bg-white flex-1 ${passwordError ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter your password"
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
                {passwordError ? <Text className="text-red-500 text-sm mt-1.5 ml-1">{passwordError}</Text> : null}
              </View>
              
              {/* Remember me & Forgot password */}
              <View className="flex-row justify-between items-center">
                <TouchableOpacity 
                  className="flex-row items-center" 
                  onPress={() => {
                    setRememberMe(!rememberMe);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View className={`w-5 h-5 rounded-md items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border border-gray-300'}`}>
                    {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text className="text-gray-700 ml-2">Remember me</Text>
                </TouchableOpacity>
                
                <Link href={"/(auth)/forgot-password" as any} asChild>
                  <TouchableOpacity 
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Text className="text-primary font-medium">Forgot Password?</Text>
                  </TouchableOpacity>
                </Link>
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
              
              {/* Login button */}
              <TouchableOpacity
                className={`py-4 rounded-xl mt-2 ${isLoading ? 'bg-blue-400' : 'bg-primary'}`}
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">Log In</Text>
                )}
              </TouchableOpacity>
              
              {/* Sign up link */}
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href={"/(auth)/register" as any} asChild>
                  <TouchableOpacity 
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Text className="text-primary font-semibold">Sign up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
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
  loginButton: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }
});
