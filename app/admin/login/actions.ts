'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

export async function login(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Those credentials did not match.' }
    throw error
  }
}
