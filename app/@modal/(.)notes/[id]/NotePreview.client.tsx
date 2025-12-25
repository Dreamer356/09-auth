"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "../../../../lib/api/clientApi";
import Modal from "../../../../components/Modal/Modal";
import styles from "./NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1 className={styles.title}>Завантаження...</h1>
            <button onClick={handleClose} className={styles.closeButton} aria-label="Закрити">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className={styles.loading}>
            <p>Завантаження нотатки...</p>
          </div>
        </div>
      );
    }

    if (isError || !note) {
      return (
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1 className={styles.title}>Помилка</h1>
            <button onClick={handleClose} className={styles.closeButton} aria-label="Закрити">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className={styles.error}>
            <p>Помилка завантаження нотатки</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h1 className={styles.title}>{note.title}</h1>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Закрити">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.meta}>
            <span className={styles.tag}>{note.tag}</span>
            <span className={styles.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.content}>
            {note.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal onClose={handleClose}>
      {renderContent()}
    </Modal>
  );
}
