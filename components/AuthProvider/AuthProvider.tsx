'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, isLoadingSession, checkSession } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('AuthProvider render:', { 
    isAuthenticated, 
    user, 
    pathname, 
    isRedirecting,
    isLoadingSession
  });

  // Приватні маршрути
  const privateRoutes = [
    '/notes',
    '/profile',
    '/notes/action/create',
    '/notes/filter'
  ];

  // Публічні маршрути
  const publicRoutes = [
    '/sign-in',
    '/sign-up'
  ];

  const isPrivateRoute = privateRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  );

  console.log('Route check:', { 
    isPrivateRoute, 
    isPublicRoute, 
    pathname,
    privateRoutes,
    publicRoutes
  });

  // Перевіряємо сесію при завантаженні
  useEffect(() => {
    console.log('AuthProvider: checking session on mount');
    checkSession();
  }, [checkSession]);

  // Логіка перенаправлення
  useEffect(() => {
    // Чекаємо завершення перевірки сесії
    if (isLoadingSession) {
      console.log('AuthProvider: waiting for session check to complete');
      return;
    }

    console.log('AuthProvider useEffect START:', { 
      isAuthenticated, 
      user,
      isPrivateRoute, 
      isPublicRoute, 
      pathname 
    });
    
    // Якщо користувач неавторизований і намагається зайти на приватну сторінку
    if (!isAuthenticated && isPrivateRoute) {
      console.log('CONDITION 1: User not authenticated on private route');
      console.log('Redirecting to sign-in...');
      setIsRedirecting(true);
      router.push('/sign-in');
      
      // Скидаємо isRedirecting через 2 секунди, якщо перенаправлення не спрацювало
      setTimeout(() => {
        console.log('Timeout: resetting isRedirecting');
        setIsRedirecting(false);
      }, 2000);
      return;
    }

    // Якщо користувач авторизований і намагається зайти на публічну сторінку
    if (isAuthenticated && isPublicRoute) {
      console.log('CONDITION 2: User authenticated on public route');
      console.log('Redirecting to profile...');
      setIsRedirecting(true);
      router.push('/profile');
      
      // Скидаємо isRedirecting через 2 секунди, якщо перенаправлення не спрацювало
      setTimeout(() => {
        console.log('Timeout: resetting isRedirecting');
        setIsRedirecting(false);
      }, 2000);
      return;
    }

    console.log('No redirect needed - all conditions passed');
    setIsRedirecting(false);
  }, [isAuthenticated, user, isPrivateRoute, isPublicRoute, router, pathname, isLoadingSession]);

  // Показуємо лоадер під час перевірки сесії або перенаправлення
  if (isLoadingSession || isRedirecting) {
    console.log('Showing LoadingIndicator - loading session or redirecting');
    return <LoadingIndicator />;
  }

  console.log('Rendering children');
  return <>{children}</>;
}