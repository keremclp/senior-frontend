import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base API URL - should be moved to environment variables later
const API_URL = 'https://stingray-app-tbaur.ondigitalocean.app/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token - implement this based on your API
        // const refreshToken = await SecureStore.getItemAsync('refresh_token');
        // const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        // const { token } = response.data;
        
        // await SecureStore.setItemAsync('auth_token', token);
        
        // Return the original request with new token
        // originalRequest.headers.Authorization = `Bearer ${token}`;
        // return apiClient(originalRequest);
        
        // For now, just logout on 401
        await SecureStore.deleteItemAsync('auth_token');
        // Redirect to login - will be handled by auth context
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
