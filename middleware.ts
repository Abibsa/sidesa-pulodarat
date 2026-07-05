import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware without database dependency
// Session check will be done at page level
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Allow all routes - protection will be handled at page level
  // This avoids Edge Runtime issues with PostgreSQL adapter
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
