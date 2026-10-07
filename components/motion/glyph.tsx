'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollTrigger, prefersReducedMotion, useGSAP } from '@/lib/motion/gsap'
import type { CharacterMoment } from '@/lib/cms/types'

/**
 * A bracketed live character that morphs through CMS-defined frames,
 * driven by scroll progress of a trigger element, section entry, or a loop.
 */
export function Glyph({
  moment,
  triggerRef,
  className,
  label,
}: {
  moment: CharacterMoment
  triggerRef?: React.RefObject<HTMLElement | null>
  className?: string
  label?: string
}) {
  const frames = moment.frames.length ? moment.frames : ['…']
  const [index, setIndex] = useState(0)
  const boxRef = useRef<HTMLSpanElement>(null)
  const trigger = moment.trigger ?? 'scroll-progress'

  useGSAP(
    () => {
      if (trigger === 'loop' || prefersReducedMotion()) return
      const el = triggerRef?.current ?? boxRef.current
      if (!el) return
      if (trigger === 'section-entry') {
        let step = 0
        ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            const id = window.setInterval(() => {
              step += 1
              setIndex(Math.min(step, frames.length - 1))
              if (step >= frames.length - 1) window.clearInterval(id)
            }, 420)
          },
        })
        return
      }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => setIndex(Math.min(frames.length - 1, Math.floor(self.progress * frames.length))),
      })
    },
    { dependencies: [frames.length, trigger] },
  )

  useEffect(() => {
    if (trigger !== 'loop' || prefersReducedMotion()) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % frames.length), 1100)
    return () => window.clearInterval(id)
  }, [frames.length, trigger])

  return (
    <span ref={boxRef} className={cn('glyph-box', className)} role="img" aria-label={label ?? moment.name}>
      <span key={index} aria-hidden="true" className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-300">
        {frames[index]}
      </span>
    </span>
  )
}
