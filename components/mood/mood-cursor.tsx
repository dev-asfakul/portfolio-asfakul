'use client'

import { useEffect, useRef } from 'react'
import { useMood } from '@/components/mood/mood-provider'
import { gsap, prefersReducedMotion } from '@/lib/motion/gsap'

export function MoodCursor() {
  const { config } = useMood()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !ref.current) return
    const node = ref.current
    const move = (event: MouseEvent) => gsap.to(node, { x: event.clientX, y: event.clientY, duration: prefersReducedMotion() ? 0 : 0.18, overwrite: true })
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={ref} aria-hidden="true" data-cursor={config.cursor} className="mood-cursor">
      {config.cursor === 'crosshair' ? <span aria-hidden="true">+</span> : config.cursor === 'blob' ? <span aria-hidden="true">●</span> : null}<span className="sr-only">{config.label} mood cursor</span>
    </div>
  )
}
