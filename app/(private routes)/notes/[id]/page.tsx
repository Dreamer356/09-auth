import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import NotePreview from '../../../@modal/(.)notes/[id]/NotePreview.client';
import { fetchNoteByIdServer } from '../../../../lib/api/serverApi';

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteByIdServer(id);

    return {
      title: note.title ? `${note.title} | NoteHub` : 'Нотатка | NoteHub',
      description: 'Переглядайте деталі вашої нотатки',
      openGraph: {
        title: note.title ? `${note.title} | NoteHub` : 'Нотатка | NoteHub',
        description: 'Переглядайте деталі вашої нотатки',
        url: `https://08-zustand-gilt.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'Нотатка',
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Нотатка | NoteHub',
      description: 'Переглядайте деталі вашої нотатки',
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id], 
    queryFn: () => fetchNoteByIdServer(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
