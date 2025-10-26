# Google OAuth Setup for Sadqa Tracker

## What You'll Need

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API** (or Google Identity API)
4. **Create OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)

5. **Copy the credentials** and add them to your `.env.local` file

## Environment Variables Needed

Add to your `app/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

## How It Works

1. User clicks "Sign in with Google" 
2. Redirected to Google's login page (your app never sees their password)
3. User logs in with their Google account on Google's servers
4. Google redirects back to your app with an authorization code
5. Your app exchanges the code for user info (name, email, etc.)
6. User is logged into your app

The user's Google password stays with Google - you only get their public profile info!
