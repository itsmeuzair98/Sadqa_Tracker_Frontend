'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the shape of our context state
interface UserContextType {
  userName: string | null;
  setUserName: (name: string | null) => void;
  isGoogleUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: googleUser, isAuthenticated } = useAuth();

  // Only support Google OAuth users
  const isGoogleUser = isAuthenticated && !!googleUser;

  // Load username from Google account only
  useEffect(() => {
    if (isGoogleUser && googleUser) {
      // Use Google user info
      setUserName(googleUser.name || googleUser.email);
    } else {
      // Clear username if not authenticated
      setUserName(null);
    }
    setIsLoading(false);
  }, [isGoogleUser, googleUser]);

  // Provide the state and setter to children
  const value = { userName, setUserName, isGoogleUser };

  if (isLoading) {
    // You can show a loader here if you want
    return null; 
  }

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