'use client';
import { cn } from '@/shared/lib';
import { Icon } from '../icon/Icon';
import { useState, useEffect, useRef } from 'react';

export type ToastStatus = 'success' | 'error';

export interface Toast {
  status: ToastStatus;
  delay?: number;
  timeStamp?: number;
  message?: React.ReactNode;
}

export const Toast = ({
  toastState,
  handleRemoveToast,
}: { toastState: Toast; handleRemoveToast: (timeStamp: number) => void }) => {
  const { status, message, timeStamp, delay } = toastState;
  const [visible, setVisible] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const removeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (timeStamp !== undefined) {
      setVisible(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (removeTimerRef.current) {
        clearTimeout(removeTimerRef.current);
      }
      removeTimerRef.current = setTimeout(() => {
        handleRemoveToast(timeStamp);
      }, 300);
    }
  };

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(animationTimer);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => {
        setVisible(false);
        removeTimerRef.current = setTimeout(() => {
          handleRemoveToast(timeStamp ?? 0);
        }, 300);
      },
      delay || 3500,
    );

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (removeTimerRef.current) {
        clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          'z-[101] cursor-pointer shadow-[0_4px_12px_0_rgba(0,0,0,0.24)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] mb-2 overflow-hidden transform will-change-transform origin-right',
          {
            'translate-y-0 bg-black/75 rounded-lg':
              visible && status === 'error',
            'opacity-0 translate-y-full': !visible && status === 'error',
            'translate-x-0 opacity-100 layer-base01 shadow-[0_4px_12px_0_rgba(0,0,0,0.24)] rounded-l-full w-fit bg-white/50 backdrop-blur-sm':
              visible && status === 'success',
            'translate-x-full opacity-0': !visible && status === 'success',
          },
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            'py-[13px] px-4 flex gap-x-2 items-center whitespace-pre-line',
            {
              'text-white': status === 'error',
              'text-black font-bold': status === 'success',
            },
          )}
        >
          {status === 'error' && <Icon name="info" size={16} className='text-red-500' />}
          {message}
        </div>
      </div>
    </>
  );
};
