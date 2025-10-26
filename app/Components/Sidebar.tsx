'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, History, BarChart3, HelpingHand , Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext'; // New import

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userName, setUserName, isGoogleUser } = useUser();
  const { logout: googleLogout } = useAuth();
  const { openModal } = useModal(); // Use the openModal function from context

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'add-sadqa', label: 'Add Sadqa', icon: Plus, href: '#' },
    { id: 'history', label: 'Sadqa History', icon: History, href: '/sadqa-history' },
    { id: 'insights', label: 'Insights', icon: BarChart3, href: '/insights' },
    { id: 'Donation Requests', label: 'Donation Requests', icon: HelpingHand , href: '/donation-requests' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
      // Google OAuth logout (database data is preserved)
      await googleLogout();
      closeMobileMenu();
    }
  };

  if (!userName) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 right-0 lg:left-0 h-full lg:h-screen w-64 bg-white shadow-lg border-l lg:border-r lg:border-l-0 border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sadqa Tracker</h2>
          {/* Close button for mobile */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col h-full">
          <nav className="flex-1 mt-6 overflow-y-auto">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              // Handle the Add Sadqa item separately
              if (item.id === 'add-sadqa') {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      openModal();
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center px-4 sm:px-6 py-3 text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100`}
                  >
                    <IconComponent className={`w-5 h-5 mr-3 flex-shrink-0 text-gray-400`} />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </button>
                );
              }
              
              // For all other items, use a standard Link
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`w-full flex items-center px-4 sm:px-6 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            {/* User Info */}
            <div className="flex items-center px-2 py-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">
                  Google Account
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-left text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}