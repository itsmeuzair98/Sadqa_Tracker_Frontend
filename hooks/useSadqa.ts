'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { SadqaEntry } from '@/app/Components/AddSadqaModal';

interface BackendSadqaEntry {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  reason: string;
  received_by: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SadqaStats {
  total_amount: number;
  total_entries: number;
  monthly_amount: number;
  monthly_entries: number;
  most_frequent_type?: string;
  types_count: Record<string, number>;
}

interface UseSadqaReturn {
  sadqaEntries: BackendSadqaEntry[];
  stats: SadqaStats | null;
  isLoading: boolean;
  error: string | null;
  createEntry: (entry: SadqaEntry) => Promise<void>;
  updateEntry: (id: number, entry: Partial<SadqaEntry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useSadqa(): UseSadqaReturn {
  const { data: session } = useSession();
  const [sadqaEntries, setSadqaEntries] = useState<BackendSadqaEntry[]>([]);
  const [stats, setStats] = useState<SadqaStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have a valid JWT token
  const hasValidJWT = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('sadqa_jwt_token');
    return !!token;
  };

  // Fetch sadqa entries from backend
  const fetchSadqaEntries = async () => {
    if (!session?.user || !hasValidJWT()) {
      console.log('No valid session or JWT token, skipping fetch');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching sadqa entries from backend...');
      const entries = await apiClient.get('/api/v1/sadqa/');
      setSadqaEntries(entries);
      
      console.log('Fetched entries:', entries.length);
    } catch (err) {
      console.error('Failed to fetch sadqa entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics from backend
  const fetchStats = async () => {
    if (!session?.user || !hasValidJWT()) {
      console.log('No valid session or JWT token, skipping stats fetch');
      return;
    }
    
    try {
      console.log('Fetching sadqa stats from backend...');
      const statsData = await apiClient.get('/api/v1/sadqa/stats');
      setStats(statsData);
      
      console.log('Fetched stats:', statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Don't set error for stats failure, just log it
    }
  };

  // Create new sadqa entry
  const createEntry = async (entry: SadqaEntry) => {
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    if (!hasValidJWT()) {
      throw new Error('Authentication token expired. Please sign in again.');
    }

    try {
      console.log('Creating sadqa entry:', entry);
      
      const newEntry = await apiClient.post('/api/v1/sadqa/', {
        type: entry.type.toUpperCase(), // Backend expects uppercase values like "MONEY", "FOOD", etc.
        amount: Number(entry.amount),
        reason: entry.reason || null,
        received_by: entry.receivedBy,
        date: entry.date + 'T00:00:00Z', // Convert date string to ISO datetime format
        notes: null
      });

      console.log('Created entry:', newEntry);
      
      // Refresh data after creation
      await refreshData();
    } catch (err) {
      console.error('Failed to create sadqa entry:', err);
      throw err;
    }
  };

  // Update sadqa entry
  const updateEntry = async (id: number, entry: Partial<SadqaEntry>) => {
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    try {
      const updateData: any = {};
      if (entry.type) updateData.type = entry.type.toUpperCase(); // Backend expects uppercase values
      if (entry.amount) updateData.amount = Number(entry.amount);
      if (entry.reason) updateData.reason = entry.reason;
      if (entry.receivedBy) updateData.received_by = entry.receivedBy;
      if (entry.date) updateData.date = entry.date + 'T00:00:00Z'; // Convert to ISO datetime format

      await apiClient.put(`/api/v1/sadqa/${id}`, updateData);
      
      // Refresh data after update
      await refreshData();
    } catch (err) {
      console.error('Failed to update sadqa entry:', err);
      throw err;
    }
  };

  // Delete sadqa entry
  const deleteEntry = async (id: number) => {
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    try {
      await apiClient.delete(`/api/v1/sadqa/${id}`);
      
      // Refresh data after deletion
      await refreshData();
    } catch (err) {
      console.error('Failed to delete sadqa entry:', err);
      throw err;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchSadqaEntries(),
      fetchStats()
    ]);
  };

  // Load data when session is available
  useEffect(() => {
    if (session?.user) {
      refreshData();
    }
  }, [session?.user]);

  return {
    sadqaEntries,
    stats,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshData,
  };
}
