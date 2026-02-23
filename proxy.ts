import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    const session = request.cookies.get('vetri_session')?.value
    const { pathname } = request.nextUrl

    // If no session and trying to access protected routes
    if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/crew'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session) {
        try {
            const user = JSON.parse(decodeURIComponent(session))

            // RBAC: Crew cannot access admin routes
            if (user.role === 'CREW' && pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/crew/dashboard', request.url))
            }

            // RBAC: Admin cannot access crew routes (optional, usually admin can see everything)
            // if (user.role === 'ADMIN' && pathname.startsWith('/crew')) {
            //     return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            // }
        } catch (e) {
            // Invalid session
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/crew/:path*'],
}
