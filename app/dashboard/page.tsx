'use client';

import { useEffect, useState } from 'react';
import AddSadqaModal, { SadqaEntry } from '../Components/AddSadqaModal';
import SadqaStats from '../Components/SadqaStats';
import RecentSadqa from '../Components/RecentSadqa';
import { useUser } from '../context/UserContext';
import { useModal } from '../context/ModalContext';
import { useSadqaContext } from '../context/SadqaContext';
import { useAuth } from '../context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';

// Simple loader component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
  </div>
);

export default function DashboardPage() {
  const { userName } = useUser();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const { sadqaEntries, stats, isLoading, error } = useSadqaContext();
  
  // Convert backend entries to frontend format for compatibility
  const sadqaData: SadqaEntry[] = sadqaEntries.map((entry: any) => ({
    type: entry.type.toLowerCase(),
    amount: entry.amount,
    reason: entry.reason || '',
    receivedBy: entry.received_by,
    date: entry.date.split('T')[0] // Convert ISO date to YYYY-MM-DD
  }));

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <a 
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!userName) {
    // This should not happen anymore since we redirect in the main page
    // But keeping it as a fallback
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <a 
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header with dynamic name */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 pt-16 lg:pt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assalamualaikum, {userName}</h1>
            {/* This button still works as before */}
            <button
              onClick={() => openModal()}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-center text-sm sm:text-base"
            >
              Add New Sadqa
            </button>
          </div>

          {/* Sadqa Stats component */}
          <SadqaStats sadqaData={sadqaData} />

          {/* Recent Sadqa component */}
          <RecentSadqa sadqaData={sadqaData} />
        </div>
      </div>
    </AuthGuard>
  );
}