import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    dbUserId?: number
    jwtToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string
    dbUserId?: number
    jwtToken?: string
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
