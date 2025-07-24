import { MODAL_SIZE } from '@/widgets';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isOpen: boolean;
  size: {
    width: number;
    height: number;
  };
  setIsOpen: (isOpen: boolean) => void;
  setSize: (size: { width: number; height: number }) => void;
}

export const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      size: {
        width: MODAL_SIZE.DEFAULT_WIDTH,
        height: MODAL_SIZE.DEFAULT_HEIGHT,
      },
      setIsOpen: (isOpen) => set({ isOpen }),
      setSize: (size) => set({ size }),
    }),
    {
      name: 'modal-storage',
    },
  ),
);
