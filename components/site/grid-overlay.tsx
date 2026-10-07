'use client'

import { useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { FULL_MOTION, gsap, useGSAP } from '@/lib/motion/gsap'

export function GridOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const { config } = useMood()

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from('span', {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.4,
          ease: 'expo.inOut',
          stagger: 0.05,
        })
        if (config.grid === 'animated') {
          gsap.to('span', {
            yPercent: (i) => (i % 2 ? -6 : 6),
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: true },
          })
        }
      })
    },
    { scope: ref, dependencies: [config.id] },
  )

  return (
    <div ref={ref} aria-hidden="true" className="grid-overlay pointer-events-none fixed inset-0 z-0 site-grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className={i >= 8 ? 'hidden lg:block' : i >= 4 ? 'hidden md:block' : 'block'} />
      ))}
    </div>
  )
}
