import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { error } = await supabase.from('users').upsert(
        {
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          last_sign_in: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      if (error) {
        console.error('[Supabase] upsert error:', error.message)
        return false
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
}
