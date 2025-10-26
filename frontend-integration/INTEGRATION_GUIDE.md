# Frontend Integration Guide

This guide shows how to integrate the FastAPI backend with your Next.js frontend.

## Step 1: Install Additional Dependencies

Add these to your frontend package.json:

```bash
npm install axios  # Alternative to fetch for API calls
```

## Step 2: Environment Variables

Add to your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Step 3: Create API Client

Copy `api-client.js` to your frontend `lib/` directory:

```
app/
  lib/
    api-client.js  # Copy from frontend-integration/api-client.js
```

## Step 4: Update User Context

Replace your existing `app/context/UserContext.tsx` with the content from `updated-user-context.tsx`.

## Step 5: Create OAuth Callback Page

Create a new file `app/auth/callback/page.tsx` with the content from `auth-callback-page.tsx`.

## Step 6: Update Components

### Update NameInputComponent

Replace the name input component with Google OAuth login:

```typescript
// app/Components/NameInputComponent.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import charityImage from '../../public/images/logo.png';

const NameInputComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center space-y-6">
        
        {/* Hadith */}
        <blockquote className="text-gray-700 italic text-sm border-l-4 border-green-500 pl-4">
          "Charity does not decrease wealth."  
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

        {/* Google Login */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600 mb-4">Sign in with Google to continue.</p>
          
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NameInputComponent;
```

### Update Dashboard to Use API

```typescript
// app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import SadqaStats from '../Components/SadqaStats';
import RecentSadqa from '../Components/RecentSadqa';
import apiClient from '../lib/api-client';

// Simple loader component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useUser();
  const [sadqaData, setSadqaData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSadqaData();
    }
  }, [isAuthenticated]);

  const loadSadqaData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSadqaEntries();
      setSadqaData(data);
    } catch (error) {
      console.error('Failed to load sadqa data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <NameInputComponent />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto">
        {/* Header with dynamic name */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 pt-16 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Assalamualaikum, {user?.name}
          </h1>
        </div>

        {/* Sadqa Stats component */}
        <SadqaStats sadqaData={sadqaData} />

        {/* Recent Sadqa component */}
        <RecentSadqa sadqaData={sadqaData} onDataUpdate={loadSadqaData} />
      </div>
    </div>
  );
}
```

### Update AddSadqaModal to Use API

Update your `AddSadqaModal.tsx` to call the API instead of using localStorage:

```typescript
// In AddSadqaModal.tsx, update the handleSubmit function:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.amount || !formData.receivedBy) {
    setShowErrorMessage(true);
    return;
  }
  
  const todayDateString = getTodayDate();
  if (formData.date > todayDateString) {
    setShowErrorMessage(true);
    return;
  }
  
  try {
    const submittedData = {
      type: formData.type,
      amount: Number(formData.amount),
      reason: formData.reason || null,
      received_by: formData.receivedBy,
      date: new Date(formData.date).toISOString(),
      notes: null
    };
    
    await apiClient.createSadqaEntry(submittedData);
    
    // Reset form
    setFormData({
      type: 'Money',
      amount: '',
      reason: '',
      receivedBy: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    onClose();
    
    // Call onSubmit if provided (for data refresh)
    if (onSubmit) {
      onSubmit(submittedData);
    }
  } catch (error) {
    console.error('Failed to create sadqa entry:', error);
    setShowErrorMessage(true);
  }
};
```

## Step 7: Update package.json Scripts

Add API-related scripts to your package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "dev:with-api": "concurrently \"cd backend && python start.py\" \"next dev\"",
    "setup:backend": "cd backend && python start.py"
  }
}
```

Install concurrently if you want to run both frontend and backend together:

```bash
npm install --save-dev concurrently
```

## Step 8: Update CORS Configuration

Make sure your backend allows your frontend domain. In your backend `.env`:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Step 9: Testing the Integration

1. Start the backend: `cd backend && python start.py`
2. Start the frontend: `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Continue with Google"
5. Complete OAuth flow
6. You should be redirected to the dashboard with API-powered data

## Common Issues and Solutions

### CORS Errors
- Ensure backend CORS is properly configured
- Check that API_URL environment variable is correct

### Authentication Issues
- Verify Google OAuth credentials are correctly set
- Check that callback URL matches in Google Console and backend config

### Network Errors
- Ensure backend is running on correct port
- Check firewall/antivirus settings

### Token Expiration
- Implement token refresh logic if needed
- Handle 401 errors gracefully

This integration replaces localStorage with proper API calls and implements secure Google OAuth authentication.
