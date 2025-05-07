import { useAuth } from "@/context/auth-context";
import { validateEmail, validatePassword } from "@/lib/utils/validation";
import * as Haptics from 'expo-haptics';
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
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
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1" contentContainerClassName="flex-grow justify-center">
        <View className="px-6 py-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-center text-primary">Welcome Back</Text>
            <Text className="text-gray-500 text-center mt-2">Log in to access your account</Text>
          </View>
          
          <View className="space-y-4">
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {emailError ? <Text className="text-red-500 text-sm mt-1">{emailError}</Text> : null}
            </View>
            
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {passwordError ? <Text className="text-red-500 text-sm mt-1">{passwordError}</Text> : null}
            </View>
            
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                className="flex-row items-center" 
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 rounded border ${rememberMe ? 'bg-primary border-primary' : 'border-gray-400'} mr-2`}></View>
                <Text className="text-gray-700">Remember me</Text>
              </TouchableOpacity>
              
              <Link href={"/(auth)/forgot-password" as any}asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            {error ? (
              <View className="bg-red-50 p-3 rounded-lg">
                <Text className="text-red-500">{error}</Text>
              </View>
            ) : null}
            
            <TouchableOpacity
              className="bg-primary py-4 rounded-lg"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-semibold">Log In</Text>
              )}
            </TouchableOpacity>
            
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href={"/(auth)/register" as any} asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
