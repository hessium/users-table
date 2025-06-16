import { type ComponentProps } from 'react';
import { type ExternalToast, toast, Toaster as Sonner } from 'sonner';
import { cn } from '../../utils/cn.ts';
import { Button } from '../button/button.tsx';

export const REMOVE_TOAST_DURATION = 5001;

export const ToastOptions = {
  error: {
    color: 'danger',
    title: 'Ошибка',
  },
  success: {
    color: 'success',
    title: 'Успешно',
  },
};

type ToasterProps = ComponentProps<typeof Sonner>;
export type ToasterRemoveProps = {
  message: string;
  onRemove: () => void;
  onCancel?: (toastId: number) => void;
};

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group [&>li]:w-full [&>li]:rounded-2xl"
    theme="light"
    visibleToasts={6}
    {...props}
  />
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 rounded-full bg-background text-foreground-text opacity-0 ring-1 ring-border transition-opacity duration-200 hover:opacity-100 group-hover/toast:opacity-100"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);

const toaster = (
  message: string,
  type?: 'success' | 'error',
  options?: ExternalToast,
) => {
  const { title, color } = ToastOptions[type || 'success'];

  return toast.custom(
    (id) => (
      <div
        className={cn(
          'group/toast relative flex min-h-12 w-full flex-col gap-1 rounded-lg border border-border bg-white px-3.5 py-1.5 text-white shadow-2xl backdrop-blur',
          color,
          type === 'error' ? 'text-red-600' : '',
        )}
      >
        <span className={cn('text-sm font-medium')}>{title}</span>
        <p className="text-xs font-medium text-zinc-500">{message}</p>
        <CloseButton onClick={() => toast.dismiss(id)} />
      </div>
    ),
    options,
  );
};

toaster.remove = (
  { message, onRemove, onCancel }: ToasterRemoveProps,
  options?: ExternalToast,
) =>
  toast.custom(
    (id) => (
      <div className="group/toast relative flex min-h-12 w-full flex-col gap-1 rounded-md border border-border bg-background px-3.5 py-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Удаление</span>
          <Button
            variant="secondary"
            onClick={() => {
              onCancel?.(id as number);
              toast.dismiss(id);
            }}
          >
            Отмена
          </Button>
        </div>

        <p className="mt-0.5 text-xs text-secondary-text">{message}</p>

        <div className="mt-2 h-2.5 w-full rounded-full bg-background">
          <div
            className="h-full animate-toast rounded-full bg-danger"
            onAnimationEnd={() => {
              onRemove();
              toast.dismiss(id);
            }}
          />
        </div>
      </div>
    ),
    { ...options, duration: REMOVE_TOAST_DURATION, position: 'top-right' },
  );

export { Toaster, toaster };
