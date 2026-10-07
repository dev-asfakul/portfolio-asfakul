'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { MOODS } from '@/lib/mood/moods'
import { gsap, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

function ScrollPercent() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setValue(max > 0 ? Math.round((window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <span className="tabular-nums">{String(value).padStart(3, '0')}%</span>
}

export function SiteNav({ shortName, resumeUrl, resumeLabel }: { shortName: string; resumeUrl?: string; resumeLabel?: string }) {
  const { mood, config, available, setMood } = useMood()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (panel && !prefersReducedMotion()) {
      gsap.fromTo(panel, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.out' })
      gsap.from(panel.querySelectorAll('[data-row]'), { yPercent: 60, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out', delay: 0.1 })
    }
    panel?.querySelector<HTMLElement>('button, a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <nav aria-label="Primary" className="site-grid items-center py-4">
          <Link href="/" className="col-span-2 text-sm font-semibold tracking-[0.2em] md:col-span-2" aria-label={`${shortName}, back to top`}>
            {shortName}
            <span className="meta ml-2 align-middle font-normal opacity-60">©</span>
          </Link>
          <ul className="meta hidden items-center gap-8 md:col-span-4 md:col-start-4 md:flex lg:col-span-4 lg:col-start-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="opacity-70 transition-opacity hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
            {resumeUrl ? <li><a href={resumeUrl} target="_blank" rel="noreferrer" className="opacity-70 transition-opacity hover:opacity-100">{resumeLabel || 'Resume'}</a></li> : null}
          </ul>
          <div className="meta col-span-2 flex items-center justify-end gap-5 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10">
            <span className="hidden opacity-60 lg:inline">
              <ScrollPercent />
            </span>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="group flex items-center gap-2"
            >
              <span className="opacity-60 md:hidden">Menu ·</span>
              <span className="opacity-60">Mood</span>
              <span className="border border-current px-1.5 py-0.5">{config.label}</span>
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Change mood"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-foreground text-background"
        >
          <div className="site-grid items-center py-4">
            <p className="meta col-span-2 md:col-span-4">Atmosphere</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                triggerRef.current?.focus()
              }}
              className="meta col-span-2 justify-self-end md:col-span-4 lg:col-span-8"
            >
              Close [esc]
            </button>
          </div>

          <ul className="mt-6 border-t border-background/15 md:hidden">
            {[
              { href: '/', label: 'Home' },
              ...LINKS,
              ...(resumeUrl ? [{ href: resumeUrl, label: resumeLabel || 'Resume', external: true }] : []),
            ].map((link) => (
              <li key={link.href} data-row className="border-b border-background/15">
                <Link href={link.href} onClick={() => setOpen(false)} target={'external' in link ? '_blank' : undefined} rel={'external' in link ? 'noreferrer' : undefined} className="block px-[var(--gutter)] py-4 text-3xl font-light tracking-tight">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <p className="meta px-[var(--gutter)] pb-4 pt-10 opacity-60">
              One identity, multiple moods. The content stays. The art direction changes.
            </p>
            <ul className="border-t border-background/15">
              {available.map((id) => {
                const m = MOODS[id]
                const active = id === mood
                return (
                  <li key={id} data-row className="border-b border-background/15">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setOpen(false)
                        setMood(id)
                      }}
                      className="site-grid group w-full items-baseline py-5 text-left md:py-7"
                    >
                      <span className="meta col-span-1 opacity-50">{m.index}</span>
                      <span
                        data-mood={id}
                        className={cn(
                          'display col-span-3 bg-transparent text-[clamp(3rem,11vw,9rem)] text-inherit transition-transform duration-500 group-hover:translate-x-3 md:col-span-4 lg:col-span-5',
                        )}
                      >
                        {m.label}
                      </span>
                      <span className="col-span-4 mt-3 hidden text-sm leading-relaxed opacity-70 md:col-span-3 md:block lg:col-span-4 lg:col-start-8">
                        {m.description}
                      </span>
                      <span className="meta col-span-3 col-start-2 mt-2 flex items-center gap-3 md:col-span-1 md:col-start-8 md:mt-0 md:justify-end lg:col-start-12">
                        <span className="flex" aria-hidden="true">
                          <span className="size-3 border border-background/30" style={{ background: m.tokens.background }} />
                          <span className="size-3 border border-background/30" style={{ background: m.tokens.foreground }} />
                          <span className="size-3 border border-background/30" style={{ background: m.tokens.accent }} />
                        </span>
                        {active ? 'Current' : 'Enter'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}
