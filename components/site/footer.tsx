'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { LiveClock } from '@/components/site/live-clock'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'
import type { About, SocialLink } from '@/lib/cms/types'
import type { Identity } from '@/lib/brand'

export function Footer({ identity, about, socials, note, settings }: { identity: Identity; about: About; socials: SocialLink[]; note?: string; settings?: { resumeUrl?: string; resumeLabel?: string; githubUrl?: string; linkedinUrl?: string } }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from('[data-footer-letter]', {
          yPercent: 100,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <footer ref={ref} data-scene="footer" className="relative z-10 overflow-hidden border-t border-line bg-background pt-12">
      <div className="meta site-grid gap-y-8 text-muted-foreground">
        <div className="col-span-2 md:col-span-2 lg:col-span-3">
          <p>Local time</p>
          <LiveClock timezone={about.timezone} className="mt-1 block tabular-nums text-foreground" />
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-3">
          <p>Mood</p>
          <p className="mt-1 text-foreground">
            {config.index} — {config.label}
          </p>
        </div>
        <nav aria-label="Footer navigation" className="col-span-2 flex flex-col gap-2 md:col-span-3 lg:col-span-2">
          <p>Navigate</p>
          <Link href="/" className="text-foreground underline-offset-4 hover:underline">Home</Link>
          <Link href="/work" className="text-foreground underline-offset-4 hover:underline">Work</Link>
          <Link href="/about" className="text-foreground underline-offset-4 hover:underline">About</Link>
          <Link href="/reviews" className="text-foreground underline-offset-4 hover:underline">Reviews</Link>
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">Contact</Link>
        </nav>
        <nav aria-label="Social links" className="col-span-2 flex flex-col gap-2 md:col-span-3 lg:col-span-4">
          <p>Elsewhere</p>
          {settings?.githubUrl ? <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">GitHub</a> : null}
          {settings?.linkedinUrl ? <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">LinkedIn</a> : null}
          {settings?.resumeUrl ? <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">{settings.resumeLabel || 'Resume'}</a> : null}
          {socials.map((s) => <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">{s.platform || s.label || s.handle || 'Social link'}</a>)}
        </nav>
        <a href="#top" className="col-span-4 text-foreground md:col-span-1 md:text-right lg:col-span-2">
          Back to top ↑
        </a>
      </div>

      <p aria-hidden="true" className="display mt-10 flex justify-between overflow-hidden px-[var(--gutter)] text-[29vw] leading-[0.78]">
        {Array.from(identity.shortName.toUpperCase()).map((c, i) => (
          <span key={i} data-footer-letter className="inline-block will-change-transform">
            {c}
          </span>
        ))}
      </p>

      <div className="meta site-grid border-t border-line py-4 text-muted-foreground">
        <p className="col-span-2 md:col-span-4">
          © {new Date().getFullYear()} {identity.fullName}
        </p>
        <p className="col-span-2 text-right md:col-span-4 lg:col-span-8">{note || 'Designed and built by hand.'}</p>
      </div>
    </footer>
  )
}
