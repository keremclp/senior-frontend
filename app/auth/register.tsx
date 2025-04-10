import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
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

const RegisterScreen = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      name: '',
      email: '', 
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await register(name, email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert(
        'Registration Failed', 
        'There was an error creating your account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-4">
          <AuthHeader title="Create Account" />
          
          <View className="mt-6">
            <Text className="text-light-300 text-base mb-6">
              Enter your details to create a new account.
            </Text>
            
            <AuthInput
              label="Full Name"
              icon="person-outline"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            
            <AuthInput
              label="Email Address"
              icon="mail-outline"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            
            <AuthInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
            
            <AuthInput
              label="Confirm Password"
              icon="shield-checkmark-outline"
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />
            
            <View className="mt-6">
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                icon="person-add-outline"
                variant="primary"
              />
            </View>
            
            <View className="flex-row justify-center mt-8">
              <Text className="text-light-300">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-accent font-medium">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
