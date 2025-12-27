import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Приватні маршрути
const privateRoutes = ['/notes', '/profile', '/notes/action/create'];

// Публічні маршрути
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  // 🔄 Оновлення сесії
  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await fetch(`${origin}/api/auth/session`, {
        method: 'GET',
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      });

      if (!sessionResponse.ok) {
        throw new Error('Session refresh failed');
      }

      const nextResponse = NextResponse.next();

      const setCookieHeader = sessionResponse.headers.get('set-cookie');

      if (setCookieHeader) {
        nextResponse.headers.append('set-cookie', setCookieHeader);
      }

      isAuthenticated = true;
      return nextResponse;
    } catch {
      const redirect = NextResponse.redirect(
        new URL('/sign-in', request.url)
      );
      redirect.cookies.delete('accessToken');
      redirect.cookies.delete('refreshToken');
      return redirect;
    }
  }

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route
  );

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
