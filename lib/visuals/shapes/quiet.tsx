import type { SceneId } from '../scenes'

type VocabularyProps = { scene: SceneId; cursorEnabled?: boolean }

export default function QuietVocabulary({ scene }: VocabularyProps) {
  return (
    <div aria-hidden="true" data-shape-mood="quiet" data-scene={scene} className="shape-vocabulary shape-vocabulary-quiet">
      <span className="shape-quiet__field" />
      <span className="shape-quiet__signal" />
      {scene === 'home-hero' ? (
        <span className="shape-quiet__paper" data-stage-piece>
          <span className="shape-quiet__fold" data-stage-piece data-fold-plane />
          <span className="shape-quiet__crease" />
        </span>
      ) : null}
    </div>
  )
}
