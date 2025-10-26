'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSadqa } from '@/hooks/useSadqa';

// Create the context type
interface SadqaContextType {
  sadqaEntries: any[];
  stats: any;
  isLoading: boolean;
  error: string | null;
  createEntry: (entry: any) => Promise<void>;
  updateEntry: (id: number, entry: any) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const SadqaContext = createContext<SadqaContextType | undefined>(undefined);

// Sadqa Provider Component
export function SadqaProvider({ children }: { children: ReactNode }) {
  const sadqaHook = useSadqa();

  return (
    <SadqaContext.Provider value={sadqaHook}>
      {children}
    </SadqaContext.Provider>
  );
}

// Custom hook to use Sadqa context
export function useSadqaContext(): SadqaContextType {
  const context = useContext(SadqaContext);
  if (context === undefined) {
    throw new Error('useSadqaContext must be used within a SadqaProvider');
  }
  return context;
}