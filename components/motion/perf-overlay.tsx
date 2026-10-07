'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { ScrollTrigger } from '@/lib/motion/gsap'

export function PerfOverlay() {
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || new URLSearchParams(window.location.search).get('perf') !== '1') return
    const update = () => setCount(ScrollTrigger.getAll().length)
    update()
    const id = window.setInterval(update, 500)
    return () => window.clearInterval(id)
  }, [])
  if (!mounted || process.env.NODE_ENV !== 'development' || typeof window === 'undefined' || new URLSearchParams(window.location.search).get('perf') !== '1') return null
  return <output className="fixed bottom-3 right-3 z-[100] rounded bg-black/80 px-3 py-2 font-mono text-xs text-white">ScrollTriggers: {count}</output>
}
