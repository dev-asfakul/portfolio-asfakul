'use client'

import { useActionState, useRef, useState } from 'react'
import { submitContact, type ContactState } from '@/app/actions/contact'
import { useMood } from '@/components/mood/mood-provider'
import { Glyph } from '@/components/motion/glyph'
import { TextSplit } from '@/components/motion/primitives'
import { MemeFigure } from '@/components/site/meme-figure'
import { cn } from '@/lib/utils'
import type { CharacterMoment, Meme } from '@/lib/cms/types'

const PROJECT_TYPES = ['Website', 'Product / App', 'Brand + Web', 'Motion / Interaction', 'Something else']

function Field({
  label,
  name,
  type = 'text',
  error,
  textarea,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  error?: string[]
  textarea?: boolean
  autoComplete?: string
}) {
  const id = `contact-${name}`
  const shared = {
    id,
    name,
    required: true,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className:
      'w-full border-0 border-b border-line bg-transparent py-3 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground md:text-xl',
  }
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="meta text-muted-foreground">
        {label}
      </label>
      {textarea ? <textarea {...shared} rows={4} className={cn(shared.className, 'resize-none')} /> : <input {...shared} type={type} />}
      {error ? (
        <p id={`${id}-error`} className="meta mt-2 text-accent">
          {error[0]}
        </p>
      ) : null}
    </div>
  )
}

export function Contact({ email, meme, glyph }: { email?: string; meme?: Meme; glyph?: CharacterMoment }) {
  const ref = useRef<HTMLElement>(null)
  const { config } = useMood()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<string>('')
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })

  return (
    <section ref={ref} id="contact" data-scene="contact" aria-labelledby="contact-title" className="relative z-10 bg-background py-[var(--section-space)]">
      <div className="site-grid gap-y-12">
        <p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12">
          <span className="text-foreground">(06)</span> Final scene
        </p>

        <h2 id="contact-title" className="col-span-4 md:col-span-8 lg:col-span-12">
          <TextSplit
            text="Have something"
            by="words"
            className={cn('display block', config.id === 'quiet' ? 'text-[clamp(3rem,10vw,10rem)]' : 'text-[clamp(3.25rem,13vw,13rem)]')}
          />
          <span className="flex flex-wrap items-baseline gap-x-[0.2em]">
            <TextSplit
              text="worth building?"
              by="words"
              delay={0.15}
              className={cn(
                'display block',
                config.id === 'quiet' ? 'text-[clamp(3rem,10vw,10rem)]' : 'text-[clamp(3.25rem,13vw,13rem)]',
                config.id === 'editorial' && 'serif-italic normal-case text-accent',
                config.id === 'play' && 'text-accent',
              )}
            />
            {glyph ? <Glyph moment={glyph} triggerRef={ref} className="text-[clamp(2rem,5vw,4.5rem)]" /> : null}
          </span>
        </h2>

        {meme ? (
          <div className="col-span-4 md:col-span-3 lg:col-span-4">
            <MemeFigure meme={meme} />
          </div>
        ) : null}

        <div className={cn('col-span-4 md:col-span-5', meme ? 'lg:col-span-7 lg:col-start-6' : 'md:col-start-4 lg:col-span-7 lg:col-start-6')}>
          {state.status === 'success' || state.status === 'delayed' ? (
            <div role="status" className="border-t border-line pt-8">
              <p className="heading text-[clamp(2rem,4vw,3.5rem)]">Message received.</p>
              <p className="mt-3 text-muted-foreground">
                {state.status === 'delayed' ? 'It is safely recorded. Email delivery is catching up, but nothing else is needed from you.' : state.message}
              </p>
            </div>
          ) : !open ? (
            <div className="flex flex-col gap-6 border-t border-line pt-8">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group flex w-full items-center justify-between text-left"
                aria-expanded={open}
                aria-controls="contact-form"
              >
                <span className="heading text-[clamp(2.25rem,6vw,5rem)]">Let&apos;s talk</span>
                <span className="glyph-box text-[clamp(2rem,5vw,4rem)] transition-transform duration-500 group-hover:translate-x-3" aria-hidden="true">
                  →
                </span>
              </button>
              {email ? (
                <p className="meta text-muted-foreground">
                  Or write directly —{' '}
                  <a href={`mailto:${email}`} className="text-foreground underline-offset-4 hover:underline">
                    {email}
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <form id="contact-form" action={action} className="flex flex-col gap-8 border-t border-line pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500" noValidate>
              <div className="grid gap-8 md:grid-cols-2">
                <Field label="Your name" name="name" autoComplete="name" error={state.fieldErrors?.name} />
                <Field label="Email" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
              </div>
              <fieldset>
                <legend className="meta mb-3 text-muted-foreground">Project type (optional)</legend>
                <input type="hidden" name="projectType" value={type} />
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={type === t}
                      onClick={() => setType(type === t ? '' : t)}
                      className={cn(
                        'meta border border-line px-3 py-2 transition-colors',
                        config.id === 'play' && 'rounded-full',
                        type === t ? 'border-foreground bg-foreground text-background' : 'hover:border-foreground',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Field label="Tell me about it" name="message" textarea error={state.fieldErrors?.message} />
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center md:justify-between">
                {state.status === 'error' ? (
                  <p role="alert" className="meta text-accent">
                    {state.message}
                  </p>
                ) : (
                  <span className="meta text-muted-foreground">Replies within two working days.</span>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    'meta inline-flex items-center gap-3 bg-foreground px-6 py-4 text-background transition-opacity disabled:opacity-50',
                    config.id === 'play' && 'rounded-full bg-accent text-accent-foreground',
                  )}
                >
                  {pending ? 'Sending…' : 'Send message'} <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
