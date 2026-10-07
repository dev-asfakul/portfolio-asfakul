'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ScrollTrigger } from '@/lib/motion/gsap'

export function ScrollReset() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.history.scrollRestoration !== 'manual') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])
  return null
}
