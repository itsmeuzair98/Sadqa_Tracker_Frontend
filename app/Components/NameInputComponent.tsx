'use client';

import { useState } from 'react';
import Image from 'next/image';
import charityImage from '../../public/images/logo.png';
// A component to get the user's name
const NameInputComponent = ({ onNameSubmit }: { onNameSubmit: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center space-y-6">
        
        {/* Hadith */}
        <blockquote className="text-gray-700 italic text-sm border-l-4 border-green-500 pl-4">
          “Charity does not decrease wealth.”  
          <span className="block mt-1 text-xs text-gray-500">– Prophet Muhammad ﷺ </span>
        </blockquote>

        {/* Charity Image */}
        <div className="w-full rounded-lg overflow-hidden">
          <Image
            src={charityImage}
            alt="Charity touching moment"
            className="rounded-lg"
            placeholder="blur"
          />
        </div>

        {/* Name Input */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600 mb-4">Please enter your name to continue.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Continue
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default NameInputComponent;