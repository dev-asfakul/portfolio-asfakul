'use client'

import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/admin/login-form'
import type { MoodId } from '@/lib/cms/types'

const moods: MoodId[] = ['editorial', 'quiet', 'play']

export function LoginScene() {
  const [mood, setMood] = useState<MoodId>('editorial')
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false })

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => setCursor({ x: event.clientX, y: event.clientY, visible: true })
    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <main data-mood={mood} className={`login-scene login-scene--${mood} min-h-screen bg-background text-foreground`}>
      <div className="login-cursor" aria-hidden="true" style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`, opacity: cursor.visible ? 1 : 0 }} />
      <div className="login-grain" aria-hidden="true" />
      <nav className="login-mood-nav" aria-label="Login mood">
        <span className="meta">SIAM / ADMIN</span>
        <div className="flex gap-2" role="group" aria-label="Choose login mood">
          {moods.map((option) => (
            <button key={option} type="button" aria-pressed={mood === option} onClick={() => setMood(option)} className="login-mood-button meta">
              {option}
            </button>
          ))}
        </div>
      </nav>

      {mood === 'editorial' ? (
        <div className="login-editorial-layout">
          <section className="login-editorial-statement" aria-labelledby="login-title">
            <p className="meta text-accent">Studio control room</p>
            <h1 id="login-title" className="display">Make the quiet work visible.</h1>
            <p className="login-support-copy">A private workspace for shaping the archive, the atmosphere, and the details behind the public experience.</p>
          </section>
          <section className="login-editorial-form" aria-labelledby="access-heading">
            <p className="meta text-accent">Access / 01</p>
            <h2 id="access-heading" className="heading text-3xl">Enter the studio</h2>
            <LoginForm />
          </section>
        </div>
      ) : null}

      {mood === 'quiet' ? (
        <div className="login-quiet-layout">
          <section className="login-quiet-intro" aria-labelledby="login-title-quiet">
            <p className="meta text-muted-foreground">A quieter threshold</p>
            <h1 id="login-title-quiet" className="heading">The work continues<br />in private.</h1>
          </section>
          <section className="login-quiet-form" aria-labelledby="access-heading-quiet">
            <p id="access-heading-quiet" className="meta text-muted-foreground">Private access</p>
            <LoginForm />
          </section>
        </div>
      ) : null}

      {mood === 'play' ? (
        <div className="login-play-layout">
          <section className="login-play-sticker" aria-labelledby="login-title-play">
            <span className="meta">03 / PLAY</span>
            <h1 id="login-title-play" className="display">Make<br /><em>more.</em></h1>
            <span className="login-play-arrow" aria-hidden="true">↗</span>
          </section>
          <section className="login-play-form" aria-labelledby="access-heading-play">
            <div className="login-play-label"><span className="meta">ACCESS PORTAL</span><span aria-hidden="true">●</span></div>
            <h2 id="access-heading-play" className="sr-only">Enter the studio</h2>
            <LoginForm />
          </section>
          <p className="login-play-note">Same studio.<br />Different energy.</p>
        </div>
      ) : null}
    </main>
  )
}
