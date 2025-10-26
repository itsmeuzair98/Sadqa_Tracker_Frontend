import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    dbUserId?: number
    jwtToken?: string
    user: DefaultSession['user'] & {
      id?: string
    }
  }

  interface User extends DefaultUser {
    id?: string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string
    dbUserId?: number
    jwtToken?: string
    user?: DefaultSession['user'] & {
      id?: string
    }
  }
}
