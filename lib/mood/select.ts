import type { CharacterMoment, CharacterPlacement, Meme, MemePlacement, MoodId } from '@/lib/cms/types'

const inMood = (scope: string | undefined, mood: MoodId) => !scope || scope === 'all' || scope === mood

export function pickMemes(memes: Meme[], placement: MemePlacement, mood: MoodId) {
  return memes.filter((m) => m.active !== false && m.image && m.placement === placement && inMood(m.mood, mood))
}

export function pickMeme(memes: Meme[], placement: MemePlacement, mood: MoodId) {
  return pickMemes(memes, placement, mood)[0]
}

export function pickCharacter(characters: CharacterMoment[], placement: CharacterPlacement, mood: MoodId) {
  return characters.find((c) => c.active !== false && c.frames?.length && c.placement === placement && inMood(c.mood, mood))
}
