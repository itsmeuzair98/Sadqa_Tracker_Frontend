'use client'; // You will need this since you are using hooks (useState) inside the modal logic

import Sidebar from './Components/Sidebar';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext'; // Import useModal
import AddSadqaModal, { SadqaEntry } from './Components/AddSadqaModal'; // Import the modal and type
import './globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Import the useSadqa hook
import { useSadqa } from '@/hooks/useSadqa';

// You can create a wrapper component inside the layout to handle the modal
// and the sadqa data logic.
function AppContent({ children }: { children: React.ReactNode }) {
  const { isModalOpen, closeModal } = useModal();
  const { createEntry } = useSadqa();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const handleAddSadqa = async (newEntry: SadqaEntry) => {
    try {
      setIsSubmitting(true);
      await createEntry(newEntry);
      closeModal();
    } catch (error) {
      console.error('Failed to add sadqa entry:', error);
      // You could add a toast notification here
      alert('Failed to add sadqa entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show sidebar on login page
  const showSidebar = pathname !== '/login';

  return (
    <>
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={showSidebar ? "flex-1" : "w-full"}>
          {children}
        </main>
      </div>
      <AddSadqaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddSadqa}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <ModalProvider>
              {/* The new wrapper component */}
              <AppContent>{children}</AppContent>
            </ModalProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}