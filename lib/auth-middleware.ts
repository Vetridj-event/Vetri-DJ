import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { User } from '@/types'

export async function getSession(): Promise<User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('vetri_session')

    if (!sessionCookie) return null

    try {
        const decoded = decodeURIComponent(sessionCookie.value)
        return JSON.parse(decoded) as User
    } catch (e) {
        return null
    }
}

export type AuthorizedHandler = (session: User) => Promise<NextResponse>

export async function withAuth(
    req: NextRequest,
    allowedRoles: User['role'][],
    handler: AuthorizedHandler
) {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 })
    }

    if (!allowedRoles.includes(session.role)) {
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 })
    }

    return handler(session)
}

/**
 * Validates the request body against a schema and handles errors consistently.
 */
export async function validateBody<T>(
    req: NextRequest,
    schema: z.Schema<T>
): Promise<{ data?: T; errorResponse?: NextResponse }> {
    try {
        const body = await req.json()
        const validated = schema.parse(body)
        return { data: validated }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                errorResponse: NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: error.errors.map(e => ({ path: e.path, message: e.message }))
                    },
                    { status: 400 }
                )
            }
        }
        return {
            errorResponse: NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }
    }
}
