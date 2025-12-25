'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import css from './sign-up.module.css';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await register({ email, password });
      setUser(user); // Зберігаємо користувача в глобальному store
      router.push('/profile');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Помилка реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            className={css.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            name="password" 
            className={css.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <div className={css.actions}>
          <button 
            type="submit" 
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Реєстрація...' : 'Register'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}