import type { Metadata } from 'next'
import CreateNote from "../../../../../components/CreateNote/CreateNote";

export const metadata: Metadata = {
  title: "Створити нотатку | NoteHub",
  description: "Створіть нову нотатку з заголовком, контентом та тегами. Зручний інтерфейс для організації ваших думок.",
  openGraph: {
    title: "Створити нотатку | NoteHub",
    description: "Створіть нову нотатку з заголовком, контентом та тегами. Зручний інтерфейс для організації ваших думок.",
    url: "https://08-zustand-gilt.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Створити нотатку - NoteHub",
      },
    ],
  },
};

export default function CreateNotePage() {
  return <CreateNote />;
}
