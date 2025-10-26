'use client';

import { useEffect, useState, useRef } from 'react';
import { Filter, Calendar, DollarSign, Users, Shirt, ChevronDown, CircleDashed } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useSadqa } from '@/hooks/useSadqa';
import AuthGuard from '@/components/AuthGuard';

// Mock SadqaEntry type
interface SadqaEntry {
  date: string;
  type: string;
  amount: number;
  reason: string;
  receivedBy: string;
}

// Simple loader component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
  </div>
);

// Helper function to get the correct icon and color
const getSadqaIcon = (type: string) => {
  switch (type) {
    case 'Money': return { component: DollarSign, color: 'green' };
    case 'Food': return { component: Users, color: 'orange' };
    case 'Clothes': return { component: Shirt, color: 'blue' };
    case 'Other': return { component: CircleDashed, color: 'purple' };
    default: return { component: DollarSign, color: 'green' };
  }
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};


export default function SadqaHistoryPage() {
  const { userName } = useUser();
  const { isAuthenticated } = useAuth();
  const { sadqaEntries, isLoading: loading } = useSadqa();
  
  const [filteredData, setFilteredData] = useState<SadqaEntry[]>([]);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [amountFilter, setAmountFilter] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Refs for dropdown and filter container
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Define the types and their icons
  const sadqaTypes = [
    { value: 'All', label: 'All Types', icon: CircleDashed, color: 'gray' },
    { value: 'Money', label: 'Money', icon: DollarSign, color: 'green' },
    { value: 'Food', label: 'Food', icon: Users, color: 'orange' },
    { value: 'Clothes', label: 'Clothes', icon: Shirt, color: 'blue' },
    { value: 'Other', label: 'Other', icon: CircleDashed, color: 'purple' },
  ];

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters whenever the sadqaEntries or filter states change
  useEffect(() => {
    // Convert backend entries to frontend format for compatibility
    const sadqaData: SadqaEntry[] = sadqaEntries.map(entry => ({
      type: entry.type.toLowerCase(),
      amount: entry.amount,
      reason: entry.reason || '',
      receivedBy: entry.received_by,
      date: entry.date.split('T')[0] // Convert ISO date to YYYY-MM-DD
    }));

    let filtered = [...sadqaData];

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(endDate));
    }

    // Type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(entry =>
        entry.type && entry.type === selectedType
      );
    }

    // Amount filter
    if (amountFilter) {
      const amount = parseFloat(amountFilter);
      if (!isNaN(amount)) {
        filtered = filtered.filter(entry => entry.amount >= amount);
      }
    }

    setFilteredData(filtered);
  }, [sadqaEntries, startDate, endDate, selectedType, amountFilter]);

  // Convert backend entries to frontend format for display - computed value
  const sadqaData: SadqaEntry[] = sadqaEntries.map(entry => ({
    type: entry.type.toLowerCase(),
    amount: entry.amount,
    reason: entry.reason || '',
    receivedBy: entry.received_by,
    date: entry.date.split('T')[0] // Convert ISO date to YYYY-MM-DD
  }));

  const handleFilter = () => {
    // The filtering is already handled by useEffect above
  };
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setIsTypeDropdownOpen(false);
  };

  const getSelectedTypeDetails = () => {
    return sadqaTypes.find(type => type.value === selectedType);
  };
  
  // Get the selected type details for the dropdown button
  const selectedTypeDetails = getSelectedTypeDetails();
  const SelectedIcon = selectedTypeDetails?.icon;
  const iconColor = selectedTypeDetails?.color;

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your sadqa history.</p>
          <a 
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sadqa History</h1>
          </div>

        {/* Filters - Simplified Layout */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Date Range Row */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                    placeholder="Start Date"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center px-2">
                <span className="text-gray-500 text-sm font-medium">to</span>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Other Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div className="relative" ref={typeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors text-sm text-left bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {SelectedIcon && (
                    <SelectedIcon className={`w-4 h-4 ${iconColor === 'gray' ? 'text-gray-400' : `text-${iconColor}-600`}`} />
                  )}
                  <span className={selectedType === 'All' ? 'text-gray-500' : 'text-gray-900'}>
                    {selectedTypeDetails?.label || 'All Types'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTypeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="py-1">
                    {sadqaTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleTypeSelect(type.value)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <IconComponent className={`w-4 h-4 ${type.color === 'gray' ? 'text-gray-400' : `text-${type.color}-600`}`} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount</label>
              <input
                type="number"
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                placeholder="Enter minimum amount"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
              />
            </div>

            {/* Filter Button */}
            <div>
              <label className="block text-sm font-medium text-transparent mb-2 select-none">Action</label>
              <button
                onClick={handleFilter}
                className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Sadqa Entries Grid - Responsive */}
        <div className="grid gap-6" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}>
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No sadqa entries found</div>
              <p className="text-gray-500">Try adjusting your filters or add some sadqa entries.</p>
            </div>
          ) : (
            filteredData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, index) => {
                const { component: Icon, color } = getSadqaIcon(entry.type);
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">{entry.type || 'Unknown'}</span>
                      <div className={`p-3 rounded-lg flex-shrink-0 ${
                        color === 'green' ? 'bg-green-100' :
                        color === 'orange' ? 'bg-orange-100' :
                        color === 'blue' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          color === 'green' ? 'text-green-600' :
                          color === 'orange' ? 'text-orange-600' :
                          color === 'blue' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-4">{formatAmount(Number(entry.amount))}</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Reason:</p>
                      <p className="text-sm text-gray-800">{entry.reason || 'No reason specified'}</p>
                      <p className="text-sm text-gray-600 font-medium">Received by:</p>
                      <p className="text-sm text-gray-800">{entry.receivedBy || 'Not specified'}</p>
                      <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Results Summary */}
        {filteredData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Showing <span className="font-semibold text-green-600">{filteredData.length}</span> of{' '}
                <span className="font-semibold">{sadqaData.length}</span> entries
              </p>
              <p className="text-xl font-bold text-gray-900">
                Total Amount: {formatAmount(filteredData.reduce((sum, entry) => sum + Number(entry.amount), 0))}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </AuthGuard>
  );
}
