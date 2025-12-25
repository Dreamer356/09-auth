"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import css from './TagsMenu.module.css';

const tags = [
  { name: 'All notes', slug: 'All' },
  { name: 'Work', slug: 'Work' },
  { name: 'Personal', slug: 'Personal' },
  { name: 'Todo', slug: 'Todo' },
  { name: 'Meeting', slug: 'Meeting' },
  { name: 'Shopping', slug: 'Shopping' },
];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Використовуємо useEffect для уникнення проблем з гідратацією
  const [currentTagName, setCurrentTagName] = useState('All notes');
  
  React.useEffect(() => {
    // Перевіряємо чи ми на сторінці фільтра
    if (pathname.includes('/notes/filter/')) {
      const pathParts = pathname.split('/notes/filter/');
      if (pathParts.length > 1) {
        const tagSlug = pathParts[1];
        const tag = tags.find(t => t.slug === tagSlug);
        setCurrentTagName(tag ? tag.name : 'All notes');
      } else {
        setCurrentTagName('All notes');
      }
    } else {
      setCurrentTagName('All notes');
    }
  }, [pathname]);

  const handleTagClick = (tagSlug: string) => {
    setIsOpen(false);
    
    // Якщо користувач неавторизований, перенаправляємо на sign-in
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
    
    // Якщо авторизований, переходимо на сторінку нотаток
    router.push(`/notes/filter/${tagSlug}`);
  };

  return (
    <div className={css.menuContainer} suppressHydrationWarning>
      <button 
        className={css.menuButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {currentTagName} ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag.slug} className={css.menuItem}>
              <button 
                onClick={() => handleTagClick(tag.slug)}
                className={css.menuLink}
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
