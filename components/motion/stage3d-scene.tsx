'use client'

import type { RefObject } from 'react'
import type { MoodId } from '@/lib/cms/types'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { motionForMood } from '@/lib/motion/tokens'

const DESKTOP_STAGE = '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

type Stage3DSceneProps = {
  active: boolean
  mood: MoodId
  rootRef: RefObject<HTMLDivElement | null>
  stageRef: RefObject<HTMLElement | null>
}

export function Stage3DScene({ active, mood, rootRef, stageRef }: Stage3DSceneProps) {
  const motion = motionForMood(mood)

  useGSAP(
    () => {
      const stage = stageRef.current
      const plane = rootRef.current
      if (!active || !stage || !plane) return

      const media = gsap.matchMedia()
      media.add(DESKTOP_STAGE, () => {
        const intensity = motion.intensity
        const artwork = plane.querySelector<HTMLElement>('[data-shape-mood]') ?? plane
        const paper = plane.querySelector<HTMLElement>('.shape-quiet__paper')
        const fold = plane.querySelector<HTMLElement>('.shape-quiet__fold')
        const editorialFrame = plane.querySelector<HTMLElement>('[data-stage-image]')
        const editorialImage = editorialFrame?.querySelector<HTMLElement>('img')
        const playPieces = gsap.utils.toArray<HTMLElement>('.shape-play__orb, .shape-play__plane', plane)
        const rootDuration = mood === 'quiet' ? motion.durations.statement : motion.durations.reveal
        const targets = Array.from(new Set([plane, artwork, paper, fold, editorialFrame, editorialImage, ...playPieces].filter((target): target is HTMLElement => target != null)))
        const rotateX = gsap.quickTo(plane, 'rotationX', { duration: rootDuration, ease: motion.eases.siamOut, overwrite: 'auto' })
        const rotateY = gsap.quickTo(plane, 'rotationY', { duration: rootDuration, ease: motion.eases.siamOut, overwrite: 'auto' })
        const paperX = paper ? gsap.quickTo(paper, 'rotationX', { duration: motion.durations.statement, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const paperY = paper ? gsap.quickTo(paper, 'rotationY', { duration: motion.durations.statement, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const foldY = fold ? gsap.quickTo(fold, 'rotationY', { duration: motion.durations.statement, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const frameX = editorialFrame ? gsap.quickTo(editorialFrame, 'rotationX', { duration: motion.durations.reveal, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const frameY = editorialFrame ? gsap.quickTo(editorialFrame, 'rotationY', { duration: motion.durations.reveal, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const frameZ = editorialFrame ? gsap.quickTo(editorialFrame, 'z', { duration: motion.durations.reveal, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const imageSkew = editorialImage ? gsap.quickTo(editorialImage, 'skewX', { duration: motion.durations.micro, ease: motion.eases.siamOut, overwrite: 'auto' }) : null
        const stickerMoves = playPieces.map((piece, index) => ({
          x: gsap.quickTo(piece, 'x', { duration: motion.durations.reveal, ease: motion.eases.siamSpring, overwrite: 'auto' }),
          y: gsap.quickTo(piece, 'y', { duration: motion.durations.reveal, ease: motion.eases.siamSpring, overwrite: 'auto' }),
          rotation: gsap.quickTo(piece, 'rotation', { duration: motion.durations.reveal, ease: motion.eases.siamSpring, overwrite: 'auto' }),
          index,
        }))
        const scrollY = gsap.quickTo(plane, 'y', { duration: motion.durations.statement, ease: motion.eases.siamOut, overwrite: 'auto' })

        stage.dataset.stageMotion = 'enabled'
        gsap.set(plane, { transformPerspective: 1100, transformStyle: 'preserve-3d' })
        gsap.set(artwork, { transformStyle: 'preserve-3d' })
        gsap.set(targets, { transformOrigin: '50% 50%' })

        const entrance = mood === 'play' && playPieces.length
          ? gsap.timeline({ paused: true }).fromTo(
              playPieces,
              { autoAlpha: 0, y: -28, scale: 0.82, rotation: -10 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: motion.durations.reveal,
                ease: motion.eases.siamSpring,
                stagger: motion.staggers.standard,
                overwrite: 'auto',
              },
            )
          : null
        entrance?.play(0)

        const pointer = { x: 0, y: 0 }
        let scrollProgress = 0
        let scrollReset: gsap.core.Tween | undefined

        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return
          const bounds = stage.getBoundingClientRect()
          if (!bounds.width || !bounds.height) return
          pointer.x = gsap.utils.clamp(-1, 1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
          pointer.y = gsap.utils.clamp(-1, 1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
          rotateX(-pointer.y * (mood === 'quiet' ? 3 : 7) * intensity)
          rotateY(pointer.x * (mood === 'quiet' ? 4 : 9) * intensity)

          if (mood === 'quiet') {
            paperX?.(-pointer.y * 4 * intensity)
            paperY?.(pointer.x * 6 * intensity)
            foldY?.((pointer.x * 14 - scrollProgress * 8) * intensity)
          }
          if (mood === 'editorial') {
            frameX?.(-pointer.y * 5 * intensity)
            frameY?.(pointer.x * 7 * intensity)
            frameZ?.(10 * intensity)
          }
          if (mood === 'play') {
            stickerMoves.forEach(({ x, y, rotation, index }) => {
              const layer = index + 1
              x(pointer.x * (8 + layer * 3) * intensity)
              y(pointer.y * (6 + layer * 2) * intensity)
              rotation(pointer.x * pointer.y * 12 * intensity + (layer - 2) * 3)
            })
          }
        }

        const onPointerLeave = () => {
          pointer.x = 0
          pointer.y = 0
          rotateX(0)
          rotateY(0)
          paperX?.(0)
          paperY?.(0)
          foldY?.(-scrollProgress * 8 * intensity)
          frameX?.(0)
          frameY?.(0)
          frameZ?.(0)
          stickerMoves.forEach(({ x, y, rotation }) => {
            x(0)
            y(0)
            rotation(0)
          })
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: stage,
          start: 'top bottom',
          end: 'bottom top',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgress = self.progress * 2 - 1
            if (mood === 'quiet') {
              scrollY(-scrollProgress * 14 * intensity)
              foldY?.((pointer.x * 14 - scrollProgress * 8) * intensity)
            }
            if (mood === 'editorial') {
              const velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 2200) * 3 * intensity
              imageSkew?.(velocity)
              scrollReset?.kill()
              scrollReset = gsap.delayedCall(0.14, () => imageSkew?.(0))
            }
          },
        })

        stage.addEventListener('pointermove', onPointerMove, { passive: true })
        stage.addEventListener('pointerleave', onPointerLeave, { passive: true })
        stage.addEventListener('pointercancel', onPointerLeave, { passive: true })

        return () => {
          stage.removeEventListener('pointermove', onPointerMove)
          stage.removeEventListener('pointerleave', onPointerLeave)
          stage.removeEventListener('pointercancel', onPointerLeave)
          scrollTrigger.kill()
          entrance?.kill()
          scrollReset?.kill()
          gsap.killTweensOf(targets)
          gsap.set(targets, { clearProps: 'transform,transformOrigin,opacity,visibility' })
          delete stage.dataset.stageMotion
        }
      })

      return () => media.revert()
    },
    { scope: stageRef, dependencies: [active, mood, motion.intensity], revertOnUpdate: true },
  )

  return null
}

export default Stage3DScene
