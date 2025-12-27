'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '../../../../lib/store/08-zustand';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const {
    user,
    isAuthenticated,
    checkSession,
    isLoading,
    updateProfile,
  } = useAuthStore();

  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Перевірка сесії
  useEffect(() => {
    if (isAuthenticated && !user) {
      checkSession();
    }
  }, [isAuthenticated, user, checkSession]);

  // Початкове значення username
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await updateProfile({ username });
      router.push('/profile');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error updating profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {/* ✅ Avatar */}
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          {/* ✅ Username */}
          <div className={css.fieldWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* ✅ Email (read-only) */}
          <div className={css.fieldWrapper}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              className={css.input}
              value={user?.email ?? ''}
              readOnly
            />
          </div>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
