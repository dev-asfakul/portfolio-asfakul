'use client'

import Link from 'next/link'

export default function GlobalError() {
  return <main className="site-grid min-h-[70svh] items-center gap-y-8 bg-background py-24"><p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12">500 / Scene interrupted</p><div className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4"><h1 className="display text-[clamp(4rem,15vw,14rem)]">Reset.</h1><p className="mt-6 max-w-md text-muted-foreground">Something unexpected happened. Try again or return to the beginning.</p><div className="mt-10 flex gap-6"><button onClick={() => window.location.reload()} className="meta border-b border-foreground pb-2">Try again →</button><Link href="/" className="meta border-b border-line pb-2">Return home →</Link></div></div></main>
}
