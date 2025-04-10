// In a real app, this would make actual API calls to your backend

const API_URL = 'https://api.youradvisorapp.com'; // Replace with your actual API URL

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Login failed');
      // }
      
      // return data;
      
      // Mock successful response for development
      return {
        user: {
          id: '1',
          name: 'Test User',
          email,
        },
        token: 'mock-jwt-token',
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/auth/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name, email, password }),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Registration failed');
      // }
      
      // return data;
      
      // Mock successful response for development
      return {
        user: {
          id: '1',
          name,
          email,
        },
        token: 'mock-jwt-token',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  resetPassword: async (email: string): Promise<void> => {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/auth/reset-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Password reset failed');
      // }
      
      // Mock successful response for development
      console.log(`Password reset requested for ${email}`);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
};

export default authService;
