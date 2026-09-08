import { StateCreator } from 'zustand';

export interface ToastMessage {
  status: 'success' | 'error' | 'info';
  delay?: number;
  message?: React.ReactNode;
  subMessage?: React.ReactNode;
}

export type TranslationFunction = (
  key: string,
  values?: Record<string, string | number>,
) => string;
export type AddToastFunction = (message: ToastMessage) => void;

export interface UtilitySlice {
  t: TranslationFunction | null;
  addToast: AddToastFunction | null;
  setTranslation: (t: TranslationFunction) => void;
  setAddToast: (addToast: AddToastFunction) => void;
}

export const createUtilitySlice: StateCreator<UtilitySlice> = set => ({
  t: null,
  addToast: null,

  setTranslation: (t: TranslationFunction) => {
    set({ t });
  },

  setAddToast: (addToast: AddToastFunction) => {
    set({ addToast });
  },
});
