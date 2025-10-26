'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface DatabaseUser {
  id: number;
  email: string;
  name: string;
  google_id: string;
  picture_url: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export function useDbSync() {
  const { data: session } = useSession();
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      syncUserToDatabase();
    }
  }, [session?.user]);

  const syncUserToDatabase = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Syncing user to database:', session.user.email);
      
      const userData = {
        email: session.user.email,
        name: session.user.name,
        sub: (session.user as any).id || session.user.email, // Fallback to email if no ID
        image: session.user.image,
      };

      const response = await apiClient.post('/api/v1/users/sync', userData);
      
      // Store the JWT token for future API calls
      if (response.access_token) {
        localStorage.setItem('sadqa_jwt_token', response.access_token);
        console.log('JWT token stored for API calls');
        
        // Trigger a re-check of JWT validity in AuthContext
        window.dispatchEvent(new Event('jwt-updated'));
      }
      
      setDbUser(response);
      console.log('User synced successfully:', response);
    } catch (err) {
      console.error('Failed to sync user:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync user');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dbUser,
    isLoading,
    error,
    syncUser: syncUserToDatabase,
  };
}
