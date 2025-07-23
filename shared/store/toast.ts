import { create } from 'zustand';

export type ToastStatus = 'success' | 'error';

export interface Toast {
  status: ToastStatus;
  delay?: number;
  timeStamp?: number;
  message?: React.ReactNode;
  subMessage?: React.ReactNode;
  type?: 'toast' | 'modal';
}

interface ToastState {
  errors: Map<number, Toast>;
  successes: Map<number, Toast>;
  add: (toast: Toast) => number;
  remove: (id: number) => void;
}

const useToast = create<ToastState>()((set, get) => ({
  errors: new Map<number, Toast>(),
  successes: new Map<number, Toast>(),
  add: (toast) => {
    const timeStamp = new Date().getTime();
    const delay = toast.delay ?? 3500;

    set((state) => {
      const newToast = { ...toast, delay, timeStamp };
      if (toast.status === 'error') {
        const newErrors = new Map([[timeStamp, newToast], ...state.errors]);
        const limitedErrors = new Map(Array.from(newErrors).slice(0, 3));
        return { ...state, errors: limitedErrors };
      }
      const newSuccesses = new Map([...state.successes, [timeStamp, newToast]]);
      const limitedSuccesses = new Map(Array.from(newSuccesses).slice(-3));
      return { ...state, successes: limitedSuccesses };
    });

    return timeStamp;
  },

  remove: (id) => {
    set((state) => {
      const newErrors = new Map(state.errors);
      const newSuccesses = new Map(state.successes);

      newErrors.delete(id);
      newSuccesses.delete(id);

      return { errors: newErrors, successes: newSuccesses };
    });
  },
}));

export default useToast;
