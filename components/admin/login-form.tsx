'use client'

import { useActionState } from 'react'
import { login } from '@/app/admin/login/actions'

const initialState: { error?: string } = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="space-y-8" aria-describedby={state.error ? 'login-error' : undefined}>
      <div className="space-y-3">
        <label htmlFor="email" className="meta block text-muted-foreground">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          placeholder="you@studio.com"
        />
      </div>
      <div className="space-y-3">
        <label htmlFor="password" className="meta block text-muted-foreground">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          placeholder="••••••••••••"
        />
      </div>
      {state.error ? (
        <p id="login-error" role="alert" className="border-l-2 border-error pl-3 text-sm text-error">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-between border border-foreground px-4 py-4 text-left transition-colors hover:bg-foreground hover:text-background disabled:cursor-wait disabled:opacity-60"
      >
        <span className="meta">{pending ? 'Checking access' : 'Continue'}</span>
        <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">↗</span>
      </button>
      <p className="meta text-muted-foreground">Protected area · credentials stay server-side</p>
    </form>
  )
}
