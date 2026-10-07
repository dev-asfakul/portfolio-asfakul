import { notFound } from 'next/navigation'
import { MoodProvider } from '@/components/mood/mood-provider'
import { PhaseTwoShowcase } from '@/components/motion/phase-two-showcase'

export default async function DesignPage({ searchParams }: { searchParams: Promise<{ mood?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { mood: requestedMood } = await searchParams
  const initialMood = requestedMood === 'quiet' || requestedMood === 'play' ? requestedMood : 'editorial'
  return <MoodProvider initialMood={initialMood} available={['quiet', 'editorial', 'play']}><PhaseTwoShowcase /></MoodProvider>
}
