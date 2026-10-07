export type Mood = "editorial" | "quiet" | "play"

export type SceneId =
  | "home-hero"
  | "home-statement"
  | "home-work"
  | "home-capabilities"
  | "home-reviews"
  | "home-contact"
  | "about-intro"
  | "about-practice"
  | "about-contact"
  | "work-index"
  | "work-detail-hero"
  | "work-detail-process"
  | "work-detail-outcome"
  | "reviews-index"
  | "admin-shell"
  | "admin-content"

export type SceneVocabulary = "editorial-rules" | "quiet-atmosphere" | "play-geometry" | "admin-hybrid"

export type SceneDefinition = {
  id: SceneId
  route: string
  section: string
  moods: Mood[]
  vocabulary: Record<Mood, SceneVocabulary>
}

const allMoods: Mood[] = ["editorial", "quiet", "play"]
const publicVocabulary = {
  editorial: "editorial-rules",
  quiet: "quiet-atmosphere",
  play: "play-geometry",
} as const

export const scenes: Record<SceneId, SceneDefinition> = {
  "home-hero": { id: "home-hero", route: "/", section: "Hero", moods: allMoods, vocabulary: publicVocabulary },
  "home-statement": { id: "home-statement", route: "/", section: "Statement", moods: allMoods, vocabulary: publicVocabulary },
  "home-work": { id: "home-work", route: "/", section: "Work", moods: allMoods, vocabulary: publicVocabulary },
  "home-capabilities": { id: "home-capabilities", route: "/", section: "Capabilities", moods: allMoods, vocabulary: publicVocabulary },
  "home-reviews": { id: "home-reviews", route: "/", section: "Reviews", moods: allMoods, vocabulary: publicVocabulary },
  "home-contact": { id: "home-contact", route: "/", section: "Contact", moods: allMoods, vocabulary: publicVocabulary },
  "about-intro": { id: "about-intro", route: "/about", section: "Introduction", moods: allMoods, vocabulary: publicVocabulary },
  "about-practice": { id: "about-practice", route: "/about", section: "Practice", moods: allMoods, vocabulary: publicVocabulary },
  "about-contact": { id: "about-contact", route: "/about", section: "Contact", moods: allMoods, vocabulary: publicVocabulary },
  "work-index": { id: "work-index", route: "/work", section: "Archive", moods: allMoods, vocabulary: publicVocabulary },
  "work-detail-hero": { id: "work-detail-hero", route: "/work/[slug]", section: "Case study introduction", moods: allMoods, vocabulary: publicVocabulary },
  "work-detail-process": { id: "work-detail-process", route: "/work/[slug]", section: "Process", moods: allMoods, vocabulary: publicVocabulary },
  "work-detail-outcome": { id: "work-detail-outcome", route: "/work/[slug]", section: "Outcome and next step", moods: allMoods, vocabulary: publicVocabulary },
  "reviews-index": { id: "reviews-index", route: "/reviews", section: "Review sequence", moods: allMoods, vocabulary: publicVocabulary },
  "admin-shell": { id: "admin-shell", route: "/admin", section: "Authenticated shell", moods: allMoods, vocabulary: { editorial: "admin-hybrid", quiet: "admin-hybrid", play: "admin-hybrid" } },
  "admin-content": { id: "admin-content", route: "/admin", section: "Content workspace", moods: allMoods, vocabulary: { editorial: "admin-hybrid", quiet: "admin-hybrid", play: "admin-hybrid" } },
}

export const SCENE_IDS = Object.keys(scenes) as SceneId[]

export function getScene(id: SceneId) {
  return scenes[id]
}

export function getSceneVocabulary(id: SceneId, mood: Mood) {
  return scenes[id].vocabulary[mood]
}

export function isSceneMoodSupported(id: SceneId, mood: Mood) {
  return scenes[id].moods.includes(mood)
}

export function listScenesForRoute(route: string) {
  return SCENE_IDS.map((id) => scenes[id]).filter((scene) => scene.route === route)
}

export default scenes
