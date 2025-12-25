'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store/08-zustand';
import css from './Profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    // Перевіряємо сесію при завантаженні компонента
    if (isAuthenticated && !user) {
      checkSession();
    }
  }, [isAuthenticated, user, checkSession]);

  // Додаємо логування для діагностики
  console.log('Profile component state:', { user, isAuthenticated, isLoading });

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
          </div>
          <div className={css.avatarWrapper}>
            <div className={css.avatar}>
              <span style={{ fontSize: '48px' }}>👤</span>
            </div>
          </div>
          <div className={css.profileInfo}>
            <p>Loading profile data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
         <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <div className={css.avatar}>
            <span style={{ fontSize: '48px' }}>👤</span>
          </div>
        </div>
        <div className={css.profileInfo}>
          <p>
            Username: {user?.username || 'Not specified'}
          </p>
          <p>
            Email: {user?.email || 'Not available'}
          </p>
        </div>
      </div>
    </main>
  );
}
