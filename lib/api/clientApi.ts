import { api } from './api';
import type { User } from '../../types/user';
import type { Note } from '../../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  username?: string;
}

export interface UpdateUserParams {
  username?: string;
  email?: string;
}

export const login = async (credentials: LoginParams): Promise<User> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterParams): Promise<User> => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getSession = async (): Promise<{ success: boolean }> => {
  const response = await api.get('/auth/session');
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  if (tag && tag !== 'All') params.append("tag", tag);

  const response = await api.get(`/notes?${params.toString()}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: { title: string; content: string; tag: string }): Promise<Note> => {
  const response = await api.post('/notes', note);
  return response.data;
};

export const updateUserProfile = async (userData: UpdateUserParams): Promise<User> => {
  const response = await api.patch('/users/me', userData);
  return response.data;
};
