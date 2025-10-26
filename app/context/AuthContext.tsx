'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  dbUserId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasValidJWT: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasValidJWT, setHasValidJWT] = useState(false);
  
  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const user = session?.user || null;
  const dbUserId = session?.dbUserId || null;

  // Store JWT token in localStorage when session loads
  useEffect(() => {
    if (session?.jwtToken && typeof window !== 'undefined') {
      localStorage.setItem('sadqa_jwt_token', session.jwtToken);
      // Trigger JWT validation after storing with a small delay
      setTimeout(() => {
        window.dispatchEvent(new Event('jwt-updated'));
      }, 100);
    }
  }, [session?.jwtToken]);

  // Check JWT token validity
  useEffect(() => {
    const checkJWTValidity = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('sadqa_jwt_token');
        
        if (token) {
          try {
            // Basic JWT token format check (header.payload.signature)
            const parts = token.split('.');
            if (parts.length === 3) {
              // Decode the payload to check expiration
              const payload = JSON.parse(atob(parts[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp > currentTime) {
                setHasValidJWT(true);
              } else {
                // Token expired
                localStorage.removeItem('sadqa_jwt_token');
                setHasValidJWT(false);
                // Don't redirect if already on login page
                if (isAuthenticated && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                  router.push('/login');
                }
              }
            } else {
              // Invalid token format
              localStorage.removeItem('sadqa_jwt_token');
              setHasValidJWT(false);
            }
          } catch (error) {
            // Invalid token
            localStorage.removeItem('sadqa_jwt_token');
            setHasValidJWT(false);
          }
        } else {
          setHasValidJWT(false);
        }
      }
    };

    // Check on mount and when dependencies change (only if page is visible)
    if (typeof document !== 'undefined' && !document.hidden) {
      checkJWTValidity();
    }

    // Listen for JWT updates
    const handleJWTUpdate = () => checkJWTValidity();
    window.addEventListener('jwt-updated', handleJWTUpdate);

    // Check JWT validity every 5 minutes (less frequent) and only when tab is active
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        checkJWTValidity();
      }
    }, 300000); // 5 minutes instead of 1 minute

    return () => {
      window.removeEventListener('jwt-updated', handleJWTUpdate);
      clearInterval(interval);
    };
  }, [isAuthenticated, router]);

  const login = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const logout = async () => {
    // Clear JWT token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sadqa_jwt_token');
    }
    setHasValidJWT(false);
    await signOut({ callbackUrl: '/login' });
  };

  const value: AuthContextType = {
    user,
    dbUserId,
    isLoading,
    isAuthenticated,
    hasValidJWT,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
