'use client'

import { useEffect, useState } from 'react'

const SPATIAL_MOTION_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number }

let frameProbe: Promise<boolean> | null = null

function hasSpatialHardware() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false

  const deviceMemory = (navigator as NavigatorWithDeviceMemory).deviceMemory
  return (
    window.matchMedia(SPATIAL_MOTION_QUERY).matches &&
    navigator.hardwareConcurrency >= 6 &&
    typeof deviceMemory === 'number' &&
    deviceMemory >= 4
  )
}

function probeFrameBudget() {
  return new Promise<boolean>((resolve) => {
    let firstFrame = 0
    let frameCount = 0

    const sample = (timestamp: number) => {
      if (document.visibilityState !== 'visible') {
        resolve(false)
        return
      }

      if (frameCount === 0) firstFrame = timestamp
      frameCount += 1

      if (frameCount < 10) {
        window.requestAnimationFrame(sample)
        return
      }

      const elapsedSeconds = (timestamp - firstFrame) / 1000
      const framesPerSecond = elapsedSeconds > 0 ? (frameCount - 1) / elapsedSeconds : 0
      resolve(framesPerSecond >= 45)
    }

    window.requestAnimationFrame(sample)
  })
}

function spatialMotionAvailable() {
  if (!hasSpatialHardware()) return Promise.resolve(false)
  frameProbe ??= probeFrameBudget()
  return frameProbe
}

export function useSpatialCapability() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let mounted = true
    const mediaQuery = window.matchMedia(SPATIAL_MOTION_QUERY)

    const evaluate = () => {
      if (!hasSpatialHardware()) {
        frameProbe = null
        setEnabled(false)
        return
      }

      void spatialMotionAvailable().then((hasCapacity) => {
        if (mounted) setEnabled(hasCapacity && hasSpatialHardware())
      })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        evaluate()
      } else {
        frameProbe = null
        setEnabled(false)
      }
    }

    mediaQuery.addEventListener('change', evaluate)
    document.addEventListener('visibilitychange', handleVisibility)
    evaluate()

    return () => {
      mounted = false
      mediaQuery.removeEventListener('change', evaluate)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return enabled
}
