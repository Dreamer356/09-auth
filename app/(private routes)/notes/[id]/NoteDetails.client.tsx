"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api/clientApi";
import styles from "./NoteDetails.module.css";

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Завантаження нотатки...</p>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Помилка завантаження нотатки</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.noteDetails}>
        <h1 className={styles.title}>{note.title}</h1>
        <div className={styles.meta}>
          <span className={styles.tag}>{note.tag}</span>
          <span className={styles.date}>
            Створено: {new Date(note.createdAt).toLocaleDateString()}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span className={styles.date}>
              Оновлено: {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={styles.content}>
          {note.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
