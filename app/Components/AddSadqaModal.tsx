'use client';

import { useState, useRef, useEffect } from 'react';
import { X, DollarSign, User, Heart, Calendar, ChevronDown } from 'lucide-react';

// Define the type for a single sadqa entry
export interface SadqaEntry {
  type: string;
  amount: number | string;
  reason: string;
  receivedBy: string;
  date: string;
}

// Define the props for the modal component
interface AddSadqaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SadqaEntry) => Promise<void>;
  isSubmitting?: boolean;
}

// A custom modal component for adding a new sadqa entry
export default function AddSadqaModal({ isOpen, onClose, onSubmit, isSubmitting = false }: AddSadqaModalProps) {
  // State to manage the form data
  const [formData, setFormData] = useState<SadqaEntry>({
    type: 'Money',
    amount: '',
    reason: '',
    receivedBy: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const reasonDropdownRef = useRef<HTMLDivElement>(null);

  // Get today's date in YYYY-MM-DD format for max date restriction
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Define the available sadqa types and their associated icons
  const sadqaTypes = [
    { value: 'Money', icon: DollarSign, color: 'green' },
    { value: 'Food', icon: User, color: 'orange' },
    { value: 'Clothes', icon: Heart, color: 'blue' },
    { value: 'Other', icon: Calendar, color: 'purple' }
  ];

  // Define the predefined reasons for sadqa
  const reasonOptions = [
    'Nazar',
    'Illness',
    'Gratitude',
    'General Charity',
    'Special Occasion',
    'Seeking Protection',
    'Other'
  ];

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (reasonDropdownRef.current && !reasonDropdownRef.current.contains(event.target as Node)) {
        setIsReasonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle selection from the reason dropdown
  const handleReasonSelect = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      reason: reason
    }));
    setIsReasonDropdownOpen(false);
  };

  // Handle changes in form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hide error message when user starts typing
    if (showErrorMessage) {
      setShowErrorMessage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.receivedBy) {
      setShowErrorMessage(true);
      return;
    }
    
    // Corrected date validation: Compare date strings directly
    const todayDateString = getTodayDate();
    if (formData.date > todayDateString) {
      // Use a custom message box instead of alert()
      // For this example, we'll just show an error message in the UI
      setShowErrorMessage(true);
      return;
    }
    
    // Ensure amount is a number before submitting
    const submittedData = {
        ...formData,
        amount: Number(formData.amount)
    };
    
    try {
      await onSubmit(submittedData);
      
      // Reset form only on successful submission
      setFormData({
        type: 'Money',
        amount: '',
        reason: '',
        receivedBy: '',
        date: new Date().toISOString().split('T')[0]
      });
      // Don't close modal here - let the parent handle it
    } catch (error) {
      // Error handling is done in parent component
      console.error('Submission error:', error);
    }
  };

  // Helper to get icon color based on sadqa type
  const getIconColor = (type: string): string => {
    const typeData = sadqaTypes.find(t => t.value === type);
    return typeData ? typeData.color : 'green';
  };

  // Helper to get icon component based on sadqa type
  const getIconComponent = (type: string): typeof DollarSign => {
    const typeData = sadqaTypes.find(t => t.value === type);
    return typeData ? typeData.icon : DollarSign;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Sadqa</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form - This section will now scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <form id="sadqa-form" onSubmit={handleSubmit} className="p-6 space-y-6 max-w-full">
            {/* Error Message Display */}
            {showErrorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                Please fill in all required fields and ensure the date is not in the future.
              </div>
            )}
            
            {/* Sadqa Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sadqa Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sadqaTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = formData.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 mr-2 ${
                          isSelected ? `text-${type.color}-600` : 'text-gray-400'
                        }`}
                      />
                      <span className={`font-medium text-sm ${
                        isSelected ? `text-${type.color}-700` : 'text-gray-600'
                      }`}>
                        {type.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="relative" ref={reasonDropdownRef}>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Sadqa
              </label>
              <button
                type="button"
                onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-sm text-left bg-white flex items-center justify-between"
              >
                <span className={formData.reason ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.reason || 'Select a reason'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform cursor-pointer ${isReasonDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isReasonDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleReasonSelect('')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Select a reason
                    </button>
                    {reasonOptions.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleReasonSelect(reason)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Received By */}
            <div>
              <label htmlFor="receivedBy" className="block text-sm font-medium text-gray-700 mb-2">
                Received By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="receivedBy"
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="e.g., Meezan Foundation, Local Mosque, etc."
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={getTodayDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors cursor-pointer"
                required
              />
            </div>

            {/* Preview Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {formData.type || 'Money'}
                  </span>
                  <div className={`p-2 bg-${getIconColor(formData.type)}-100 rounded-lg`}>
                    {(() => {
                      const IconComponent = getIconComponent(formData.type);
                      return <IconComponent className={`w-4 h-4 text-${getIconColor(formData.type)}-600`} />;
                    })()}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ₹{formData.amount || '0'}
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {formData.reason || 'No reason specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Received by: {formData.receivedBy || 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No date selected'}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Actions - These will remain at the bottom */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="sadqa-form"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Sadqa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
