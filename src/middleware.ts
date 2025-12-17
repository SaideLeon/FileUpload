import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from './lib/session';
 
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isPublicPage = isAuthPage || pathname === '/' || pathname === '/documentation';

  // If the user is logged in and trying to access an auth page or landing page,
  // redirect them to their projects.
  if (session && (isAuthPage || pathname === '/')) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // If the user is not logged in and trying to access a protected page,
  // redirect them to login.
  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|files).*)'],
}
