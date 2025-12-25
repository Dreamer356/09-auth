'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './Auth.module.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      
      <div className={styles.authToggle}>
        {isLogin ? (
          <button onClick={() => setIsLogin(false)}>
            Немає акаунту? Зареєструватися
          </button>
        ) : (
          <button onClick={() => setIsLogin(true)}>
            Вже є акаунт? Увійти
          </button>
        )}
      </div>
    </div>
  );
}
