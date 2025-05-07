import { useAuth } from "@/context/auth-context";
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
  
  // Validation functions
  const validateName = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };
  
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };
  
  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };
  
  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };
  
  const handleRegister = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
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
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const passwordStrength = getPasswordStrength();
  
  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      case 5: return "Very Strong";
      default: return "";
    }
  };
  
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-300";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-green-600";
      default: return "bg-gray-300";
    }
  };
  
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
                onBlur={validateName}
              />
              {nameError ? <Text className="text-red-500 text-sm mt-1">{nameError}</Text> : null}
            </View>
            
            <View>
              <TextInput
                className={`border rounded-lg p-4 bg-white ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={validateEmail}
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
                onBlur={validatePassword}
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
                      {getStrengthText()}
                    </Text>
                  </View>
                  <View className="h-1.5 w-full bg-gray-200 rounded-full">
                    <View 
                      className={`h-1.5 rounded-full ${getStrengthColor()}`}
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
                onBlur={validateConfirmPassword}
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