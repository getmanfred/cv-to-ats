import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(_req: NextRequestWithAuth) {
    return undefined
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // POST /api/feedback is the public user-facing form — always allow
        if (req.nextUrl.pathname === '/api/feedback' && req.method === 'POST') {
          return true
        }
        return (
          !!token &&
          typeof token.email === 'string' &&
          token.email.endsWith('@getmanfred.com')
        )
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/feedback', '/api/issues'],
}
