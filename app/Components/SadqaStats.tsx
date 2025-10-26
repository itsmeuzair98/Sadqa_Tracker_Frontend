'use client';

import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { SadqaEntry } from '../Components/AddSadqaModal';


interface SadqaStatsProps {
  sadqaData: SadqaEntry[];}


export default function SadqaStats({ sadqaData }: SadqaStatsProps) {
  const calculateTotalAmount = () => {
    return sadqaData.reduce((sum, entry) => sum + Number(entry.amount), 0);
  };

  const calculateMonthlyAmount = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return sadqaData.reduce((sum, entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
        return sum + Number(entry.amount);
      }
      return sum;
    }, 0);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMostFrequentType = () => {
    if (sadqaData.length === 0) return 'N/A';
    const typeCounts = sadqaData.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {});
    const mostFrequent = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b);
    return mostFrequent;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-sm sm:text-base">Total Sadqa Given</h3>
          <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(calculateTotalAmount())}</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-sm sm:text-base">Sadqa This Month</h3>
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatAmount(calculateMonthlyAmount())}</p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-600 font-medium text-sm sm:text-base">Most Frequent Type</h3>
          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{getMostFrequentType()}</p>
      </div>
    </div>
  );
}