import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionServer } from './lib/api/serverApi';

// Приватні маршрути
const privateRoutes = ['/profile', '/notes'];

// Публічні (auth) маршрути
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  // 🔄 ОНОВЛЕННЯ СЕСІЇ (ВИМОГА ТЗ)
  if (!accessToken && refreshToken) {
    try {
      const response = await getSessionServer();

      const nextResponse = NextResponse.next();

      /**
       * axios response:
       * response.headers['set-cookie'] -> string[] | undefined
       * (це безпечно для TS і Vercel)
       */
      const setCookies = response.headers['set-cookie'];

      if (Array.isArray(setCookies)) {
        setCookies.forEach(cookie => {
          nextResponse.headers.append('Set-Cookie', cookie);
        });
      }

      isAuthenticated = true;

      // ❗ ПІСЛЯ refresh — перевіряємо auth-маршрути
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL('/profile', request.url)
        );
      }

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

  const isAuthRoute = authRoutes.includes(pathname);

  // ❌ Неавтентифікований → приватний маршрут
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // ❌ Автентифікований → auth-маршрут
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
