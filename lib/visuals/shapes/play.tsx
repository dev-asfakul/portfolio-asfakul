import type { SceneId } from '../scenes'

type VocabularyProps = { scene: SceneId }

export default function PlayVocabulary({ scene }: VocabularyProps) {
  return (
    <div aria-hidden="true" data-shape-mood="play" data-scene={scene} className="shape-vocabulary shape-vocabulary-play">
      <span data-cursor-mode="attract" className="shape-play__orb shape-play__orb--blue" />
      <span data-cursor-mode="repel" className="shape-play__orb shape-play__orb--lime" />
      <span data-cursor-mode="attract" className="shape-play__orb shape-play__orb--pink" />
      <span className="shape-play__plane shape-play__plane--blue" />
      <span className="shape-play__plane shape-play__plane--lime" />
    </div>
  )
}
