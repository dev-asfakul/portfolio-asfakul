import type { SceneId } from '../scenes'

type VocabularyProps = { scene: SceneId; cursorEnabled?: boolean }

export default function PlayVocabulary({ scene, cursorEnabled = true }: VocabularyProps) {
  return (
    <div aria-hidden="true" data-shape-mood="play" data-scene={scene} className="shape-vocabulary shape-vocabulary-play">
      <span data-cursor-mode={cursorEnabled ? 'attract' : undefined} data-stage-piece data-sticker="orb-blue" className="shape-play__orb shape-play__orb--blue" />
      <span data-cursor-mode={cursorEnabled ? 'repel' : undefined} data-stage-piece data-sticker="orb-lime" className="shape-play__orb shape-play__orb--lime" />
      <span data-cursor-mode={cursorEnabled ? 'attract' : undefined} data-stage-piece data-sticker="orb-pink" className="shape-play__orb shape-play__orb--pink" />
      <span data-stage-piece data-sticker="plane-blue" className="shape-play__plane shape-play__plane--blue" />
      <span data-stage-piece data-sticker="plane-lime" className="shape-play__plane shape-play__plane--lime" />
    </div>
  )
}
