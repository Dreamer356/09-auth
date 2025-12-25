'use client';

import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '../../lib/store/08-zustand';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

// Динамічний імпорт для оптимізації
const AuthForm = lazy(() => import('./AuthForm'));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingIndicator />}>
        <AuthForm />
      </Suspense>
    );
  }

  return <>{children}</>;
}
