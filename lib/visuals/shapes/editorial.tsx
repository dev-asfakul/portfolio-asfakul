import type { SceneId } from '../scenes'

type VocabularyProps = { scene: SceneId }

export default function EditorialVocabulary({ scene }: VocabularyProps) {
  return (
    <div aria-hidden="true" data-shape-mood="editorial" data-scene={scene} className="shape-vocabulary shape-vocabulary-editorial">
      <span className="shape-editorial__frame" />
      <span className="shape-editorial__rule shape-editorial__rule--accent" />
      <span className="shape-editorial__registration shape-editorial__registration--top" />
      <span className="shape-editorial__registration shape-editorial__registration--bottom" />
    </div>
  )
}
