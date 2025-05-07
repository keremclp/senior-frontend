import { useAuth } from "@/context/auth-context";
import { getPasswordStrength, getStrengthColor, getStrengthText, validateConfirmPassword, validateEmail, validateName, validatePassword } from "@/lib/utils/validation";
import * as Haptics from 'expo-haptics';
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
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
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 40
        }}
      >
        <View className="max-w-sm w-full self-center">
          <Text className="text-3xl font-bold text-center text-primary">Create Account</Text>
          <Text className="text-gray-500 text-center mt-2 mb-8">Sign up to get started</Text>
          
          <View className="space-y-6">
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                onBlur={handleValidateName}
              />
              {nameError ? <Text className="text-red-500 text-sm mt-1">{nameError}</Text> : null}
            </View>
            
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={handleValidateEmail}
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
                onBlur={handleValidatePassword}
                secureTextEntry
              />
              {passwordError ? (
                <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
              ) : password ? (
                <View className="mt-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm text-gray-600">Password Strength:</Text>
                    <Text className={`text-sm ${
                      passwordStrength < 3 ? 'text-red-500' : 
                      passwordStrength < 4 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </Text>
                  </View>
                  <View className="h-1.5 w-full bg-gray-200 rounded-full">
                    <View 
                      className={`h-1.5 rounded-full ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </View>
                </View>
              ) : null}
            </View>
            
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={handleValidateConfirmPassword}
                secureTextEntry
              />
              {confirmPasswordError ? <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text> : null}
            </View>
            
            {error ? (
              <View className="bg-red-50 p-3 rounded-lg">
                <Text className="text-red-500">{error}</Text>
              </View>
            ) : null}
            
            <TouchableOpacity
              className="bg-primary py-4 rounded-lg mt-2"
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-semibold">Create Account</Text>
              )}
            </TouchableOpacity>
            
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Log in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}