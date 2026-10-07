import type { NextFetchEvent, NextRequest } from 'next/server'

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { auth } = await import('@/auth')
  const middleware = auth as unknown as (request: NextRequest, event: NextFetchEvent) => Response | Promise<Response>
  return middleware(request, event)
}

export const config = {
  matcher: ['/admin/:path*'],
}
