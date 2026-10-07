'use client'

import { useEffect, type RefObject } from 'react'
import type { Mood } from './scenes'

type CursorManagerOptions = {
  mood: Mood
  rootRef: RefObject<HTMLElement | null>
}

export function useCursorManager({ mood, rootRef }: CursorManagerOptions) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || mood !== 'play' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-cursor-mode]'))
    if (!targets.length) return

    let frame = 0
    let pointer = { x: 0, y: 0 }
    let active = false

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      active = true
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const update = () => {
      frame = 0
      if (!active) return
      for (const target of targets) {
        const bounds = target.getBoundingClientRect()
        const dx = pointer.x - (bounds.left + bounds.width / 2)
        const dy = pointer.y - (bounds.top + bounds.height / 2)
        const distance = Math.max(Math.hypot(dx, dy), 1)
        const mode = target.dataset.cursorMode
        const strength = mode === 'repel' ? -Math.min(20, 900 / distance) : Math.min(14, 700 / distance)
        target.style.setProperty('--cursor-x', `${(dx / distance) * strength}px`)
        target.style.setProperty('--cursor-y', `${(dy / distance) * strength}px`)
      }
    }

    root.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      root.removeEventListener('pointermove', onPointerMove)
      if (frame) window.cancelAnimationFrame(frame)
      for (const target of targets) {
        target.style.removeProperty('--cursor-x')
        target.style.removeProperty('--cursor-y')
      }
    }
  }, [mood, rootRef])
}

export default useCursorManager
