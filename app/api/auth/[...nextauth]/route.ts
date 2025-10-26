import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Backend API base URL - Updated for Render deployment
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
        
        // Sync user to backend database
        try {
          console.log('Attempting to sync user to database:', user.email)
          console.log('Backend URL:', BACKEND_URL)
          
          const response = await fetch(`${BACKEND_URL}/api/v1/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              sub: user.id,
              image: user.image,
            }),
          })
          
          console.log('Sync response status:', response.status)
          
          if (response.ok) {
            const dbUser = await response.json()
            token.dbUserId = dbUser.id // Store database user ID
            token.jwtToken = dbUser.access_token // Store the JWT token
            console.log('User synced to database successfully:', {
              email: dbUser.email,
              dbId: dbUser.id,
              hasJWT: !!dbUser.access_token
            })
          } else {
            const errorText = await response.text()
            console.error('Failed to sync user to database:', response.status, errorText)
          }
        } catch (error) {
          console.error('Error syncing user to database:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      // Ensure user object exists with proper fallbacks
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user
        }
      }
      session.dbUserId = token.dbUserId // Include database user ID
      session.jwtToken = token.jwtToken // Include JWT token for API calls
      return session
    },
    async signIn({ user, account, profile }) {
      // You can add custom logic here if needed
      return true
    },
  },
  pages: {
    signIn: '/login', // Custom sign-in page
    error: '/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
