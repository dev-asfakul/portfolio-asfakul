"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import type { Mood, SceneId } from "@/lib/visuals/scenes"
import { useSceneScroll } from "@/lib/visuals/scroll"

const EditorialVocabulary = dynamic(() => import("@/lib/visuals/shapes/editorial"), { ssr: false })
const QuietVocabulary = dynamic(() => import("@/lib/visuals/shapes/quiet"), { ssr: false })
const PlayVocabulary = dynamic(() => import("@/lib/visuals/shapes/play"), { ssr: false })

const vocabularyByMood = {
  editorial: EditorialVocabulary,
  quiet: QuietVocabulary,
  play: PlayVocabulary,
} satisfies Record<Mood, typeof EditorialVocabulary>

type ShapeLayerProps = {
  mood: Mood
  scene: SceneId
}

export function ShapeLayer({ mood, scene }: ShapeLayerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const Vocabulary = vocabularyByMood[mood]
  useSceneScroll({ rootRef, mood, scene })
  return (
    <div ref={rootRef} data-shape-scroll-root className="pointer-events-none absolute inset-0 z-0">
      <Vocabulary scene={scene} />
    </div>
  )
}
