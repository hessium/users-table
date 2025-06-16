import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

interface ApiErrorParseProps<T extends FieldValues> {
  setError: UseFormSetError<T>;
  name?: string;
}

export const apiErrorParse = <E extends object | string, T extends FieldValues>(
  errors: E,
  { setError, name }: ApiErrorParseProps<T>,
) => {
  if (typeof errors === 'string') {
    setError(name as FieldPath<T>, {
      message: errors,
    });

    return;
  }

  for (const [k, v] of Object.entries(errors)) {
    setError(k as FieldPath<T>, {
      message: v[0] as string,
    });
  }
};
