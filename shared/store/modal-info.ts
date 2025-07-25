'use client';

import { MODAL_CONSTANTS } from '@/widgets';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isOpen: boolean;
  size: {
    width: number;
    height: number;
  };
  previousPath: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setSize: (size: { width: number; height: number }) => void;
  setPreviousPath: (path: string | null) => void;
}

export const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      size: {
        width: MODAL_CONSTANTS.DEFAULT_WIDTH,
        height: MODAL_CONSTANTS.DEFAULT_HEIGHT,
      },
      previousPath: null,
      setIsOpen: (isOpen) => set({ isOpen }),
      setSize: (size) => set({ size }),
      setPreviousPath: (path) => set({ previousPath: path }),
    }),
    {
      name: 'modal-storage',
    },
  ),
);
