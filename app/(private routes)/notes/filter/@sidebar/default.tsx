"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './SidebarNotes.module.css';

const tags = [
  { name: 'All notes', slug: 'All' },
  { name: 'Work', slug: 'Work' },
  { name: 'Personal', slug: 'Personal' },
  { name: 'Todo', slug: 'Todo' },
  { name: 'Meeting', slug: 'Meeting' },
  { name: 'Shopping', slug: 'Shopping' },
];

export default function SidebarNotes() {
  const pathname = usePathname() || '';
  const currentTag = pathname.includes('/notes/filter/') 
    ? pathname.split('/notes/filter/')[1] 
    : 'All';

  return (
    <aside className={css.sidebar}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag.slug} className={css.menuItem}>
            <Link 
              href={`/notes/filter/${tag.slug}`} 
              className={`${css.menuLink} ${currentTag === tag.slug ? css.active : ''}`}
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
