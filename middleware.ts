import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Приватні маршрути, які потребують авторизації
const privateRoutes = [
  '/notes',
  '/profile',
  '/notes/action/create'
];

// Публічні маршрути, доступні тільки неавторизованим
const publicRoutes = [
  '/sign-in',
  '/sign-up'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const isAuthenticated = !!(accessToken || refreshToken);

  // Перевіряємо чи це приватний маршрут
  const isPrivateRoute = privateRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Перевіряємо чи це публічний маршрут
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  );

  // Якщо користувач неавторизований і намагається зайти на приватну сторінку
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач авторизований і намагається зайти на публічну сторінку
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};