import { Toast } from './Toast';
import { cn } from '@/shared/lib';
import useToast from '@/shared/store/toast';

export default function ToastMessage() {
  const { errors, successes, remove } = useToast();
  const errorToastList = Array.from(errors.values());
  const successToastList = Array.from(successes.values());

  const handleRemoveToast = (id: number) => {
    remove(id);
  };

  return (
    <>
      <div
        className={cn('fixed z-[101] cursor-pointer top-20 right-0')}
      >
        {successToastList.map((s) => (
          <div
            key={s.timeStamp}
            className="flex justify-end w-full"
          >
            <Toast
              handleRemoveToast={handleRemoveToast}
              toastState={s}
            />
          </div>
        ))}
      </div>
      <div
        className={cn(
          'absolute z-[101] cursor-pointer bottom-20 right-0 left-0 mx-4',
        )}
      >
        {errorToastList.map((e) => (
          <Toast
            handleRemoveToast={handleRemoveToast}
            key={e.timeStamp}
            toastState={e}
          />
        ))}
      </div>
    </>
  );
}
