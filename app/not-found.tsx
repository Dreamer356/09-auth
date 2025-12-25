import type { Metadata } from 'next'
import css from './not-found.module.css'

export const metadata: Metadata = {
  title: "404 - Сторінку не знайдено | NoteHub",
  description: "Вибачте, сторінка, яку ви шукаєте, не існує. Поверніться на головну сторінку NoteHub.", 
  openGraph: {
    title: "404 - Сторінку не знайдено | NoteHub",
    description: "Вибачте, сторінка, яку ви шукаєте, не існує. Поверніться на головну сторінку NoteHub.",
    url: "https://08-zustand-gilt.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 - Сторінку не знайдено",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  )
}
