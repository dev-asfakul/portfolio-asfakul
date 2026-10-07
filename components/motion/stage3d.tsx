'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { CmsImage } from '@/components/media/cms-image'
import EditorialVocabulary from '@/lib/visuals/shapes/editorial'
import PlayVocabulary from '@/lib/visuals/shapes/play'
import QuietVocabulary from '@/lib/visuals/shapes/quiet'
import { useSpatialCapability } from '@/lib/motion/spatial-capability'
import type { MediaRef, MoodId } from '@/lib/cms/types'
import { cn } from '@/lib/utils'

type Stage3DSceneProps = {
  active: boolean
  mood: MoodId
  rootRef: RefObject<HTMLDivElement | null>
  stageRef: RefObject<HTMLElement | null>
}

const Stage3DScene = dynamic<Stage3DSceneProps>(() => import('./stage3d-scene').then((module) => module.Stage3DScene), {
  ssr: false,
  loading: () => null,
})

const stageLabels: Record<MoodId, string> = {
  quiet: 'Quiet paper-fold study.',
  editorial: 'Editorial image-depth study.',
  play: 'Playful kinetic-shape study.',
}

export function Stage3D({ mood, image, className }: { mood: MoodId; image?: MediaRef | null; className?: string }) {
  const stageRef = useRef<HTMLElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const capable = useSpatialCapability()
  const [hasEntered, setHasEntered] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!capable || !stage || typeof IntersectionObserver === 'undefined') {
      setActive(false)
      return
    }

    let isIntersecting = false
    const updateActiveState = () => {
      const visible = isIntersecting && document.visibilityState === 'visible'
      setActive(visible)
      if (isIntersecting) setHasEntered(true)
    }
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      updateActiveState()
    }, { threshold: 0.01 })
    const updateDocumentVisibility = () => updateActiveState()

    observer.observe(stage)
    document.addEventListener('visibilitychange', updateDocumentVisibility)
    updateActiveState()

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateDocumentVisibility)
    }
  }, [capable])

  return (
    <figure
      ref={stageRef}
      aria-label={stageLabels[mood]}
      className={cn('signature-stage', className)}
      data-capable={capable ? 'true' : 'false'}
      data-mood={mood}
      data-stage-active={active ? 'true' : 'false'}
      role="img"
    >
      <div ref={rootRef} className="signature-stage__plane" data-stage-plane>
        {mood === 'editorial' ? (
          <div className="signature-stage__image" data-stage-image aria-hidden="true">
            {image ? (
              <CmsImage media={image} alt="" sizes="(min-width: 768px) 38vw, 100vw" aspect="4:3" />
            ) : (
              <span className="signature-stage__image-fallback" />
            )}
          </div>
        ) : null}

        <div data-shape-scroll-root className="pointer-events-none absolute inset-0 z-0">
          {mood === 'quiet' ? <QuietVocabulary scene="home-hero" /> : null}
          {mood === 'editorial' ? <EditorialVocabulary scene="home-hero" /> : null}
          {mood === 'play' ? <PlayVocabulary scene="home-hero" cursorEnabled={false} /> : null}
        </div>
      </div>
      {capable && hasEntered ? <Stage3DScene active={active} mood={mood} rootRef={rootRef} stageRef={stageRef} /> : null}
    </figure>
  )
}

export default Stage3D
