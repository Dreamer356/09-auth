import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionServer } from './lib/api/serverApi';

// Приватні маршрути
const privateRoutes = ['/notes', '/profile', '/notes/action/create'];

// Публічні маршрути (тільки для неавторизованих)
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  // 🔑 Якщо accessToken відсутній, але є refreshToken — пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const response = await getSessionServer();

      const nextResponse = NextResponse.next();

      // прокидуємо оновлені cookies
      response.headers.getSetCookie()?.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });

      isAuthenticated = true;
      return nextResponse;
    } catch (error) {
      const redirectResponse = NextResponse.redirect(
        new URL('/sign-in', request.url)
      );
      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.delete('refreshToken');
      return redirectResponse;
    }
  }

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route
  );

  // ❌ Неавторизований → приватний маршрут
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // ❌ Авторизований → auth-сторінка
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
