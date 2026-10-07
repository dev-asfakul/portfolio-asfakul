'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { MoodId } from '@/lib/cms/types'

const nav = [
  { href: '/admin', label: 'Overview', index: '00' },
  { href: '/admin/projects', label: 'Projects', index: '01' },
  { href: '/admin/reviews', label: 'Reviews', index: '02' },
  { href: '/admin/skills', label: 'Capabilities', index: '03' },
  { href: '/admin/socials', label: 'Socials', index: '04' },
  { href: '/admin/about', label: 'About', index: '05' },
  { href: '/admin/now', label: 'Now', index: '06' },
  { href: '/admin/media', label: 'Media', index: '07' },
  { href: '/admin/messages', label: 'Inbox', index: '08' },
]

const moods: MoodId[] = ['editorial', 'quiet', 'play']

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mood, setMood] = useState<MoodId>('editorial')

  useEffect(() => {
    document.documentElement.dataset.mood = mood
  }, [mood])

  return (
    <main className="admin-shell min-h-screen bg-background text-foreground">
      <aside className="admin-rail" aria-label="Admin navigation">
        <div className="admin-rail-top">
          <Link href="/admin" className="admin-mark" aria-label="Admin overview">
            <span className="meta">SIAM</span>
            <strong>CONTROL<br />ROOM</strong>
          </Link>
          <p className="admin-rail-note">A private instrument<br />for the public work.</p>
        </div>
        <nav className="admin-nav" aria-label="Studio sections">
          {nav.map((item) => {
            const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`admin-nav-link ${active ? 'is-active' : ''}`}>
                <span className="meta">{item.index}</span>
                <span>{item.label}</span>
                <span className="admin-nav-arrow" aria-hidden="true">↗</span>
              </Link>
            )
          })}
        </nav>
        <div className="admin-rail-bottom">
          <span className="meta">MOOD / {mood.toUpperCase()}</span>
          <div className="admin-mood-switcher" role="group" aria-label="Choose admin mood">
            {moods.map((option) => (
              <button key={option} type="button" aria-pressed={mood === option} onClick={() => setMood(option)}>
                {option}
              </button>
            ))}
          </div>
          <Link href="/" className="meta admin-public-link">View public site <span aria-hidden="true">↗</span></Link>
        </div>
      </aside>
      <section className="admin-content">
        <header className="admin-mobile-header">
          <span className="meta">SIAM / ADMIN</span>
          <span className="meta">{mood.toUpperCase()}</span>
        </header>
        {children}
      </section>
    </main>
  )
}

export function AdminNavMood() {
  return null
}

export type { MoodId }
