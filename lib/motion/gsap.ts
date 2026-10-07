'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Observer, CustomEase, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollToPlugin, useGSAP)
  CustomEase.create('siamOut', '0.22, 1, 0.36, 1')
  CustomEase.create('siamInOut', '0.65, 0, 0.35, 1')
  CustomEase.create('siamSpring', '0.34, 1.56, 0.64, 1')
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const HOVER = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
export const DESKTOP_MOTION = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
export const FULL_MOTION = DESKTOP_MOTION

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

export { gsap, ScrollTrigger, useGSAP }
