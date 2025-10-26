'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useDbSync } from '@/hooks/useDbSync';
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

export default function TestPage() {
  const { user, dbUserId, isAuthenticated, isLoading } = useAuth();
  const { dbUser, isLoading: syncLoading, error, syncUser } = useDbSync();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
          <p className="text-gray-600 mb-4">Please sign in to test the database integration</p>
          <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Integration Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NextAuth Session Data */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">NextAuth Session</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Image:</strong> {user?.image ? (
                <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full inline ml-2" />
              ) : 'N/A'}</p>
              <p><strong>Google ID:</strong> {(user as any)?.id || 'N/A'}</p>
              <p><strong>DB User ID:</strong> {dbUserId || 'N/A'}</p>
            </div>
          </div>

          {/* Database User Data */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Database User</h2>
            {syncLoading ? (
              <p className="text-gray-500">Loading database user...</p>
            ) : error ? (
              <div>
                <p className="text-red-500 mb-2">Error: {error}</p>
                <button 
                  onClick={syncUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Retry Sync
                </button>
              </div>
            ) : dbUser ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {dbUser.id}</p>
                <p><strong>Name:</strong> {dbUser.name}</p>
                <p><strong>Email:</strong> {dbUser.email}</p>
                <p><strong>Google ID:</strong> {dbUser.google_id}</p>
                <p><strong>Verified:</strong> {dbUser.is_verified ? 'Yes' : 'No'}</p>
                <p><strong>Active:</strong> {dbUser.is_active ? 'Yes' : 'No'}</p>
                <p><strong>Created:</strong> {new Date(dbUser.created_at).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(dbUser.updated_at).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-gray-500">No database user found</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
          <div className="bg-gray-50 border rounded-lg p-4">
            {dbUser ? (
              <p className="text-green-600">✅ Database integration is working! DB User ID: {dbUser.id}</p>
            ) : syncLoading ? (
              <p className="text-yellow-600">🔄 Syncing user to database...</p>
            ) : error ? (
              <p className="text-red-600">❌ Database sync failed: {error}</p>
            ) : (
              <p className="text-gray-600">⏳ Waiting to sync user to database...</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <a href="/dashboard" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4">
            Go to Dashboard
          </a>
          <a href="/login" className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
