'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useMood } from '@/components/mood/mood-provider'
import { FULL_MOTION, HOVER, REDUCED, gsap, useGSAP } from '@/lib/motion/gsap'
import { motionForMood } from '@/lib/motion/tokens'
import { useSpatialCapability } from '@/lib/motion/spatial-capability'

function useMotionScope() {
  const scope = useRef<HTMLDivElement>(null)
  const { mood } = useMood()
  const motion = motionForMood(mood)
  return { scope, motion }
}

export function SplitReveal({ children, className }: { children: ReactNode; className?: string }) {
  const { scope, motion } = useMotionScope()
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.from('[data-split-piece]', { yPercent: 110, duration: motion.durations.reveal, ease: motion.eases.siamOut, stagger: motion.staggers.standard, scrollTrigger: { trigger: scope.current, start: 'top 82%', end: 'bottom 55%', toggleActions: 'play none none reverse', immediateRender: false, invalidateOnRefresh: true } })); mm.add(REDUCED, () => gsap.set('[data-split-piece]', { clearProps: 'all' })); return () => mm.revert() }, { scope })
  return <div ref={scope} className={cn('overflow-hidden', className)}>{children}</div>
}

export function MaskImage({ children, className }: { children: ReactNode; className?: string }) {
  const { scope, motion } = useMotionScope()
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.fromTo(scope.current, { clipPath: 'inset(100% 0 0)' }, { clipPath: 'inset(0% 0 0)', duration: motion.durations.section, ease: motion.eases.siamInOut, scrollTrigger: { trigger: scope.current, start: 'top 85%', end: 'bottom 45%', toggleActions: 'play none none reverse', immediateRender: false, invalidateOnRefresh: true } })); return () => mm.revert() }, { scope })
  return <div ref={scope} className={cn('overflow-hidden', className)}>{children}</div>
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const { scope, motion } = useMotionScope()
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add(HOVER, () => { const node = scope.current!; const move = (e: PointerEvent) => { const r = node.getBoundingClientRect(); gsap.to(node, { x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.12, duration: motion.durations.micro, ease: motion.eases.siamOut, overwrite: true }) }; const reset = () => gsap.to(node, { x: 0, y: 0, duration: motion.durations.reveal, ease: motion.eases.siamSpring }); node.addEventListener('pointermove', move); node.addEventListener('pointerleave', reset); return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset) } }); return () => mm.revert() }, { scope })
  return <div ref={scope} className={className}>{children}</div>
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const { scope, motion } = useMotionScope()
  const spatialMotionEnabled = useSpatialCapability()

  useGSAP(
    () => {
      const node = scope.current
      if (!node || !spatialMotionEnabled) return

      gsap.set(node, { transformPerspective: 900, transformStyle: 'preserve-3d' })
      const rotateX = gsap.quickTo(node, 'rotateX', { duration: motion.durations.reveal, ease: motion.eases.siamOut })
      const rotateY = gsap.quickTo(node, 'rotateY', { duration: motion.durations.reveal, ease: motion.eases.siamOut })
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        const bounds = node.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return

        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        rotateX(-y * 9 * motion.intensity)
        rotateY(x * 9 * motion.intensity)
      }
      const reset = () => {
        rotateX(0)
        rotateY(0)
      }

      node.addEventListener('pointermove', move, { passive: true })
      node.addEventListener('pointerleave', reset)
      node.addEventListener('pointercancel', reset)

      return () => {
        node.removeEventListener('pointermove', move)
        node.removeEventListener('pointerleave', reset)
        node.removeEventListener('pointercancel', reset)
        gsap.killTweensOf(node)
        gsap.set(node, { clearProps: 'transform,transformPerspective,transformStyle' })
      }
    },
    { scope, dependencies: [spatialMotionEnabled, motion.intensity, motion.durations.reveal, motion.eases.siamOut], revertOnUpdate: true },
  )

  return <div ref={scope} className={cn(spatialMotionEnabled && 'will-change-transform', className)} data-spatial-tilt={spatialMotionEnabled ? 'active' : 'static'}>{children}</div>
}

export function VelocitySkew({ children, className }: { children: ReactNode; className?: string }) {
  const { scope } = useMotionScope()
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => { const node = scope.current!; let last = window.scrollY; const update = () => { const velocity = window.scrollY - last; last = window.scrollY; gsap.to(node, { skewY: gsap.utils.clamp(-3, 3, velocity * .08), duration: .2, overwrite: true }) }; window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }); return () => mm.revert() }, { scope })
  return <div ref={scope} className={className}>{children}</div>
}

export function Marquee({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn('overflow-hidden whitespace-nowrap', className)}><div className="inline-flex min-w-max animate-[marquee_24s_linear_infinite]">{children}{children}</div></div> }
export function PinnedSequence({ children, className }: { children: ReactNode; className?: string }) { const { scope, motion } = useMotionScope(); useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.timeline({ scrollTrigger: { trigger: scope.current, start: 'top 15%', end: '+=120%', scrub: motion.scrub, pin: true, invalidateOnRefresh: true } }).from('[data-sequence]', { autoAlpha: 0, y: 32, stagger: motion.staggers.relaxed })); return () => mm.revert() }, { scope }); return <div ref={scope} className={className}>{children}</div> }
export function HorizontalRail({ children, className }: { children: ReactNode; className?: string }) { const { scope } = useMotionScope(); useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.to('[data-rail]', { xPercent: -50, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top 80%', end: 'bottom 20%', scrub: 0.8, invalidateOnRefresh: true } })); return () => mm.revert() }, { scope }); return <div ref={scope} className={cn('overflow-hidden', className)}><div data-rail className="flex w-max">{children}</div></div> }
export function FlipGrid({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn('grid', className)}>{children}</div> }
export function DrawLine({ className }: { className?: string }) { const { scope } = useMotionScope(); useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.fromTo(scope.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: .8, ease: 'siamOut', scrollTrigger: { trigger: scope.current, start: 'top 85%', toggleActions: 'play none none reverse', immediateRender: false, invalidateOnRefresh: true } })); return () => mm.revert() }, { scope }); return <span ref={scope} className={cn('block h-px w-full origin-left bg-current', className)} aria-hidden="true" /> }
export function Counter({ value }: { value: number }) { const { scope } = useMotionScope(); useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => { const state = { value: 0 }; gsap.to(state, { value, duration: 1, ease: 'siamOut', scrollTrigger: { trigger: scope.current, start: 'top 85%', toggleActions: 'play none none reverse', invalidateOnRefresh: true }, onUpdate: () => { if (scope.current) scope.current.textContent = Math.round(state.value).toString() } }) }); return () => mm.revert() }, { scope, dependencies: [value] }); return <span ref={scope}>0</span> }
export function Cursor({ children }: { children: ReactNode }) { return <>{children}</> }
export function Preloader({ children }: { children: ReactNode }) { return <>{children}</> }
export function PageTransition({ children }: { children: ReactNode }) { return <>{children}</> }
export function SectionProgress({ className }: { className?: string }) { const { scope } = useMotionScope(); useGSAP(() => { const mm = gsap.matchMedia(); mm.add(FULL_MOTION, () => gsap.fromTo(scope.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true } })); return () => mm.revert() }, { scope }); return <span ref={scope} className={cn('fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-current', className)} aria-label="Reading progress" role="progressbar" /> }

export function PrimitiveLabel({ children }: { children: ReactNode }) { return <span data-split-piece className="inline-block">{children}</span> }
