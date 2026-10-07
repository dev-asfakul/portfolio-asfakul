import Link from 'next/link'

export default function NotFound() {
  return <main className="site-grid min-h-[70svh] items-center gap-y-8 bg-background py-24"><p className="meta col-span-4 text-muted-foreground md:col-span-8 lg:col-span-12">404 / Missing scene</p><div className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4"><h1 className="display text-[clamp(4rem,15vw,14rem)]">Not here.</h1><p className="mt-6 max-w-md text-muted-foreground">That page has moved, changed shape, or never existed.</p><Link href="/" className="meta mt-10 inline-flex border-b border-foreground pb-2">Return home →</Link></div></main>
}
