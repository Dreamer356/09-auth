import { cookies } from 'next/headers';
import { api } from './api';
import type { User } from '../../types/user';
import type { Note } from '../../types/note';
import type { LoginParams, RegisterParams } from './clientApi';

// Функції для серверних компонентів з використанням cookies() з next/headers
export const loginServer = async (credentials: LoginParams): Promise<User> => {
  const cookieStore = await cookies();
  const response = await api.post('/auth/login', credentials, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const registerServer = async (credentials: RegisterParams): Promise<User> => {
  const cookieStore = await cookies();
  const response = await api.post('/auth/register', credentials, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const getCurrentUserServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const response = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const getSessionServer = async () => {
  const cookieStore = await cookies();
  const response = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};

// Функції для роботи з нотатками
export const fetchNotesServer = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = await cookies();
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  if (tag && tag !== 'All') params.append("tag", tag);

  const response = await api.get(`/notes?${params.toString()}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const createNoteServer = async (note: { title: string; content: string; tag: string }): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.post('/notes', note, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const deleteNoteServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.delete(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const updateNoteServer = async (id: string, note: { title?: string; content?: string; tag?: string }): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.patch(`/notes/${id}`, note, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
