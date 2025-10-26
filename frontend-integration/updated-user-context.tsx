// Updated UserContext to work with API authentication

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../frontend-integration/api-client';

// Define the shape of our context state
interface UserContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiClient.getToken();
      if (token) {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      const response = await apiClient.getGoogleAuthUrl();
      window.location.href = response.authorization_url;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to easily access the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
