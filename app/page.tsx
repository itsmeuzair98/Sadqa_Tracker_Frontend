'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';

export default function HomePage() {
  const { userName } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (userName) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [userName, router]);

  // Show a simple loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
}