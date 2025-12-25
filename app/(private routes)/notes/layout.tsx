import { ReactNode } from 'react';
import css from '../../LayoutNotes.module.css';

export default function NotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={css.layout}>
      <main className={css.main}>
        {children}
      </main>
    </div>
  );
}