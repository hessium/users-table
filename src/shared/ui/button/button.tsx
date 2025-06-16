import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader } from '../loader/loader.tsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md px-4 py-2 font-bold cursor-pointer tap-highlight-transparent text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white rounded hover:bg-white hover:text-black',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost:
          'shadow-sm bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      isLoading = false,
      disabled = false,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <button
        ref={forwardedRef}
        disabled={disabled || isLoading}
        className={buttonVariants({ variant, className })}
        {...props}
      >
        {isLoading ? (
          <div className="inline-flex items-center">
            <Loader />
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);
