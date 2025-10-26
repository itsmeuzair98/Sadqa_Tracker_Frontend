'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, hasValidJWT, isLoading } = useAuth();
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Show expired message if user is authenticated but JWT is invalid
    if (isAuthenticated && !hasValidJWT && !isLoading) {
      setShowExpiredMessage(true);
      setCountdown(3); // Reset countdown to 3 seconds
      
      // Auto-redirect after 3 seconds
      const redirectTimer = setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    }
    // Reset expired message if JWT becomes valid again
    else if (hasValidJWT) {
      setShowExpiredMessage(false);
    }
  }, [isAuthenticated, hasValidJWT, isLoading]);

  // Countdown timer effect
  useEffect(() => {
    if (showExpiredMessage && countdown > 0) {
      const countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(countdownTimer);
    }
  }, [showExpiredMessage, countdown]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or no valid JWT
  if (!isAuthenticated || (isAuthenticated && !hasValidJWT && !showExpiredMessage)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to access your Sadqa tracker.</p>
          <a 
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // JWT expired
  if (showExpiredMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-yellow-800 mb-4">Session Expired</h1>
            <p className="text-yellow-700 mb-4">
              Your authentication session has expired. You'll be redirected to sign in again.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm text-yellow-600">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <a 
              href="/login"
              className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Sign In Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated and valid JWT
  return <>{children}</>;
}

export default AuthGuard;
