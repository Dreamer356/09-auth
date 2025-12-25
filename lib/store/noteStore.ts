import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface NoteDraft {
  title: string;
  content: string;
  tag: string;
}

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: NoteDraft;
  setDraft: (partial: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);