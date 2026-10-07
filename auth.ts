import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { consumeLoginAttempt, isSessionRevoked, revokeSession, clearSessionRevocation } from '@/lib/auth/rate-limit'

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(1).max(512),
})

export const { handlers, auth, signIn, signOut: nextAuthSignOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 12 },
  pages: { signIn: '/admin/login' },
  providers: [
    Credentials({
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      authorize: async (raw) => {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
        if (!adminEmail || !adminPasswordHash) return null
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null
        if (!(await consumeLoginAttempt(parsed.data.email))) return null
        const emailOk = parsed.data.email === adminEmail
        const passwordOk = await bcrypt.compare(parsed.data.password, adminPasswordHash)
        if (!emailOk || !passwordOk) return null
        await clearSessionRevocation('admin')
        return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = 'admin'
      if (token.sub && await isSessionRevoked(token.sub)) {
        return {}
      }
      return token
    },
  session({ session, token }) {
    const user = session.user as typeof session.user & { id: string; role?: 'admin' }
    user.id = token.sub ?? 'admin'
    user.role = token.role as 'admin' | undefined
    return session
  },

    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (pathname === '/admin/login') return true
      if (pathname.startsWith('/admin')) {
        const devBypass = process.env.NODE_ENV !== 'production' && process.env.ADMIN_DEV_BYPASS === 'true'
        return devBypass || (session?.user as { role?: string } | undefined)?.role === 'admin'
      }
      return true
    },
  },
})

export async function signOut(options?: Parameters<typeof nextAuthSignOut>[0]) {
  const session = await auth()
  const sessionId = session?.user?.id ?? 'admin'
  await revokeSession(sessionId)
  return nextAuthSignOut(options)
}

export async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string } | undefined)?.role === 'admin'
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
}
