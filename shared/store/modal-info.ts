'use client';

import { MODAL_CONSTANTS } from '@/widgets';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  size: {
    width: number;
    height: number;
  };
  setSize: (size: { width: number; height: number }) => void;
  isRouting: boolean;
  setIsRouting: (routing: boolean) => void;
}

export const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      size: {
        width: MODAL_CONSTANTS.DEFAULT_WIDTH,
        height: MODAL_CONSTANTS.DEFAULT_HEIGHT,
      },
      setSize: (size) => set({ size }),
      isRouting: false,
      setIsRouting: (routing) => set({ isRouting: routing }),
    }),
    {
      name: 'modal-storage',
    },
  ),
);
