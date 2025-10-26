// OAuth Callback Handler for Google Authentication
// This should be created as a new page: app/auth/callback/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import apiClient from '../../../frontend-integration/api-client';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 className="font-bold">Authentication Failed</h3>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onRetry}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for token and user data
        const authData = await apiClient.handleGoogleCallback(code);
        
        // Set user in context
        setUser(authData.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
        
      } catch (error) {
        console.error('Authentication callback failed:', error);
        setError(error.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  const handleRetry = () => {
    router.push('/');
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return <Loader />;
}
