import apiClient from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  university?: string;
  engineeringField?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  university?: string;
  engineeringField?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (registerData: RegisterData): Promise<{ user: User }> => {
    const response = await apiClient.post<{ user: User }>('/auth/register', registerData);
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<{ msg: string; resetToken?: string }> => {
    const response = await apiClient.post<{ msg: string; resetToken?: string }>('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string): Promise<{ msg: string }> => {
    const response = await apiClient.post<{ msg: string }>(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
  
  logout: async (): Promise<{ msg: string }> => {
    const response = await apiClient.post<{ msg: string }>('/auth/logout');
    return response.data;
  },
};
