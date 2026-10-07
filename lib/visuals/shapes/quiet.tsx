import type { SceneId } from '../scenes'

type VocabularyProps = { scene: SceneId }

export default function QuietVocabulary({ scene }: VocabularyProps) {
  return (
    <div aria-hidden="true" data-shape-mood="quiet" data-scene={scene} className="shape-vocabulary shape-vocabulary-quiet">
      <span className="shape-quiet__field" />
      <span className="shape-quiet__signal" />
    </div>
  )
}
