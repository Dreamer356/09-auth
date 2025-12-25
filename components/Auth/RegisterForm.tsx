'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/08-zustand';
import styles from './Auth.module.css';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/notes/filter/All');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    
    try {
      await register({ email, password });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Помилка реєстрації');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Реєстрація</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            minLength={6}
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Підтвердіть пароль
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
            minLength={6}
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>
    </div>
  );
}
