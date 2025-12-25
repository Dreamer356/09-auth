'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in'); // Редірект на сторінку Login після виходу
    } catch (error) {
      console.error('Помилка виходу:', error);
    }
  };

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>
            Register
          </Link>
        </li>
      </>
    );
  }

  // Якщо користувач авторизований - показуємо Profile та Logout
  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          {user?.username && <span className={css.userName}>{user.username}</span>}
          <button 
            onClick={handleLogout}
            className={css.logoutButton}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  // Якщо користувач не авторизований - показуємо Register та Login
  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-up" className={css.navigationLink}>
          Register
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-in" className={css.navigationLink}>
          Login
        </Link>
      </li>
    </>
  );
}