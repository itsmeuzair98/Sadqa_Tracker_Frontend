# Google OAuth Setup Guide for Sadqa Tracker

## Quick Setup Steps

1. **Create `.env.local` file** in your project root with:

```env
# NextAuth Configuration  
NEXTAUTH_SECRET=your-32-character-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Add your credentials here)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

2. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable "Google+ API" 
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

3. **Generate NextAuth Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Test**: Visit `http://localhost:3000/login` and try Google login

## Why These Credentials Are Needed

**These are YOUR APP'S credentials, not user passwords:**

- **Client ID**: Tells Google "this is the Sadqa Tracker app"  
- **Client Secret**: Proves your app is legitimate to Google
- **Users log in with THEIR OWN Google accounts** - you never see their passwords
- **Google handles all security** and just tells your app "this user is authenticated"

## Current Status

✅ **NextAuth.js integrated** - Industry standard OAuth library
✅ **Dual login options** - Google OAuth + Quick name login  
✅ **Seamless UX** - Toggle between login methods
✅ **Security built-in** - Never handles user passwords
✅ **Ready for credentials** - Just add your Google app settings

Visit **http://localhost:3000/login** to see the new login options!
