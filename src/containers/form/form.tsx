import type { HTMLAttributes, ReactNode } from 'react';
import {
  type FieldValues,
  useFormContext,
  type UseFormReturn,
} from 'react-hook-form';

import { Button } from '../../shared/ui/button/button.tsx';
import { cn } from '../../shared/utils/cn.ts';

export interface FormPropsChildren extends UseFormReturn<FieldValues> {
  isValid: boolean;
  resetButton: ReactNode;
}

interface Form extends Omit<HTMLAttributes<HTMLFormElement>, 'children'> {
  children: (props: FormPropsChildren) => ReactNode;
  className?: string;
}

export const Form = ({ children, className, ...props }: Form) => {
  const context = useFormContext();

  const isValid = !Object.values(context.formState.errors).length;

  const resetButton = (
    <Button variant="ghost" onClick={() => context.reset()}>
      Отменить
    </Button>
  );

  return (
    <form {...props} className={cn('form', className)}>
      {children({
        isValid,
        resetButton,
        ...context,
      })}
    </form>
  );
};
