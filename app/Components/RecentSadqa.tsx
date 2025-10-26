'use client';

import { DollarSign, User, Heart } from 'lucide-react';
import { SadqaEntry } from '../Components/AddSadqaModal';




interface RecentSadqaProps {
  sadqaData: SadqaEntry[];
}

// Helper function to get the correct icon and color
const getSadqaIcon = (type: string) => {
  switch (type) {
    case 'Money': return { component: DollarSign, color: 'green' };
    case 'Food': return { component: User, color: 'orange' };
    case 'Clothes': return { component: Heart, color: 'blue' };
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

export default function RecentSadqa({ sadqaData }: RecentSadqaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Sadqa</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {sadqaData.length > 0 ? (
            sadqaData.slice(-3).reverse().map((entry, index) => {
              const { component: Icon, color } = getSadqaIcon(entry.type);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">{entry.type}</span>
                    <div className={`p-2 bg-${color}-100 rounded-lg flex-shrink-0`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{formatAmount(Number(entry.amount))}</p>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-600">{entry.reason || 'No reason specified'}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Received by: {entry.receivedBy}</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 xl:col-span-3 text-center text-gray-500 py-8">
              No sadqa entries yet. Add one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}