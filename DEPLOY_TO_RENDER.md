# 🚀 Deploy Sadqa Tracker Frontend to Render

## Prerequisites
- ✅ Your code is pushed to GitHub repository
- ✅ Backend is deployed at `https://sadqa-tracker-backend.onrender.com`
- ✅ Google OAuth credentials are configured

## Deployment Options

### Option 1: Quick Deploy via Render Dashboard

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New"** → **"Web Service"**

2. **Connect Repository**
   - Connect your GitHub: `itsmeuzair98/Sadqa_Tracker`
   - Select branch: `dev`

3. **Configure Service**
   ```
   Service Name: sadqa-tracker-frontend
   Region: Choose your region (e.g., Oregon US West)
   Branch: dev
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free (or upgrade as needed)
   ```

4. **Add Environment Variables**
   
   **Option A: Upload Environment File**
   - Go to your service → Environment tab
   - Upload `.env.render.template` as `.sadqa-tracker-frontend.env`
   - Update the placeholder values with your actual keys
   
   **Option B: Manual Entry**
   Add these variables one by one in Render's Environment section:
   ```
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=https://sadqa-tracker-frontend.onrender.com
   GOOGLE_CLIENT_ID=your_google_client_id_here  
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXT_PUBLIC_BACKEND_URL=https://sadqa-tracker-backend.onrender.com
   NEXT_PUBLIC_APP_URL=https://sadqa-tracker-frontend.onrender.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build to complete (~5-10 minutes)

### Option 2: Infrastructure as Code (render.yaml)

Your `render.yaml` file is already configured! Just:
1. Push to GitHub
2. In Render dashboard, select "Deploy from repository"
3. Choose your repo and Render will auto-detect the `render.yaml`

## Post-Deployment Steps

### 1. Update Google OAuth Settings
Go to [Google Cloud Console](https://console.cloud.google.com):
- **Authorized JavaScript origins**: Add `https://sadqa-tracker-frontend.onrender.com`
- **Authorized redirect URIs**: Add `https://sadqa-tracker-frontend.onrender.com/api/auth/callback/google`

### 2. Test Your Deployment
- **Frontend**: https://sadqa-tracker-frontend.onrender.com
- **Backend Health**: https://sadqa-tracker-backend.onrender.com/health
- **Test Login**: Try Google OAuth login

### 3. Monitor Deployment
- Check Render logs for any errors
- Ensure backend connectivity
- Test all features (login, add sadqa, view history)

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check Node.js version (should be 18+)
2. **OAuth Issues**: Verify Google Cloud Console redirect URIs
3. **API Connection**: Ensure backend URL is correct
4. **Environment Variables**: Double-check all required env vars

### Render Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month limit

## Your App URLs:
- **Production**: https://sadqa-tracker-frontend.onrender.com
- **Backend**: https://sadqa-tracker-backend.onrender.com

## Next Steps:
1. Deploy and test
2. Consider upgrading to paid tier for production use
3. Set up custom domain if needed
4. Configure monitoring and alerts

Happy deploying! 🎉