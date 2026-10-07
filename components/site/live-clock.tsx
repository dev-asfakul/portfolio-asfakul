'use client'

import { useEffect, useState } from 'react'

export function LiveClock({ timezone, className }: { timezone?: string; className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    let formatter: Intl.DateTimeFormat
    try {
      formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone || undefined,
      })
    } catch {
      formatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    }
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [timezone])

  return (
    <time className={className} suppressHydrationWarning>
      {time ?? '--:--:--'}
    </time>
  )
}
