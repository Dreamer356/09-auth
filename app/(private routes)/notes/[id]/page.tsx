import type { Metadata } from 'next'
import NotePreview from "../../../@modal/(.)notes/[id]/NotePreview.client";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  
  return {
    title: "Нотатка | NoteHub",
    description: "Переглядайте деталі вашої нотатки",
    openGraph: {
      title: "Нотатка | NoteHub",
      description: "Переглядайте деталі вашої нотатки",
      url: `https://08-zustand-gilt.vercel.app/notes/${resolvedParams.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Нотатка",
        },
      ],
    },
  };
}

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const resolvedParams = await params;

  return <NotePreview id={resolvedParams.id} />;
}