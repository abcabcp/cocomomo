import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostSearchState {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  tags: string[] | null;
  setTags: (tag: string) => void;
  resetTags: () => void;
  resetAllSearchFilter: () => void;
}

export const usePostSearchStore = create(
  persist<PostSearchState>(
    (set) => ({
      searchTerm: '',
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      tags: null,
      setTags: (tag) =>
        set((state) => ({
          tags: state.tags?.includes(tag)
            ? state.tags.filter((t) => t !== tag)
            : [...(state.tags ?? []), tag],
        })),
      resetTags: () => set({ tags: null }),
      resetAllSearchFilter: () => set({ searchTerm: '', tags: null }),
    }),
    {
      name: 'post-search',
    },
  ),
);
