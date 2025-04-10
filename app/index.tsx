import React from 'react';
import { Redirect } from "expo-router";
import { useAuth } from './context/auth-context';

export default function Index() {
  const { user, isLoading } = useAuth();
  
  // Show loading state or redirect based on authentication
  if (isLoading) return null;
  
  // Redirect to login if not authenticated, otherwise to home
  return <Redirect href={user ? "/home" : "/auth/login"} />;
}