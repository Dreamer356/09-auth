'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { useNoteStore } from '../../lib/store/noteStore';
import styles from './NoteForm.module.css';

export default function NoteForm() {
const { draft, setDraft, clearDraft } = useNoteStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/All');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    createNoteMutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Заголовок
        </label>
        <input
          type="text"
          id="title"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={styles.input}
          placeholder="Введіть заголовок нотатки"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          Зміст
        </label>
        <textarea
          id="content"
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={styles.textarea}
          placeholder="Введіть зміст нотатки"
          rows={6}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag" className={styles.label}>
          Категорія
        </label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
          className={styles.select}
        >
          <option value="All">Всі</option>
          <option value="Work">Робота</option>
          <option value="Personal">Особисте</option>
          <option value="Ideas">Ідеї</option>
          <option value="Important">Важливо</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          Скасувати
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Створення...' : 'Створити нотатку'}
        </button>
      </div>
    </form>
  );
}