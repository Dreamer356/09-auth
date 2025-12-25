import { deleteNote } from "../../lib/api/clientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "../../types/note";
import styles from "./NoteList.module.css";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  if (notes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Нотаток не знайдено</p>
      </div>
    );
  }

  return (
    <div className={styles.noteList}>
      {notes.map((note) => (
        <div key={note.id} className={styles.noteCard}>
          <div className={styles.noteHeader}>
            <h3 className={styles.noteTitle}>{note.title}</h3>
            <span className={styles.noteTag}>{note.tag}</span>
          </div>
          <p className={styles.noteContent}>
            {note.content.length > 150
              ? `${note.content.substring(0, 150)}...`
              : note.content}
          </p>
          <div className={styles.noteActions}>
            <Link href={`/notes/${note.id}`} className={styles.viewButton}>
              Переглянути
            </Link>
            <button
              onClick={() => handleDelete(note.id)}
              className={styles.deleteButton}
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? "Видалення..." : "Видалити"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}