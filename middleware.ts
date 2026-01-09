import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')
  
  if (!session) {
     const {pathname} = request.nextUrl
     if(pathname === '/') return NextResponse.redirect(new URL('/api/auth/signin', request.url))
     else
      if (pathname.startsWith('/api/trpc')) {
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/trpc/:path*'],
}
