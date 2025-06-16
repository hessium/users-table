import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useId,
} from 'react';
import {
  Controller,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { Vld } from '../../utils/form-validator.ts';
import { mergeRefs } from '../../utils/merge-refs.ts';
import { cn } from '../../utils/cn.ts';

type BaseProps = Omit<ComponentProps<'input'>, 'name' | 'onChange'>;

export interface InputProps extends BaseProps {
  name: string;
  onChange?: (name: string, value: string) => void;
  rules?: Vld | RegisterOptions;
  hasClear?: boolean;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { name, rules, hasClear = true, label, onChange, ...props },
    forwardedRef,
  ) => {
    const { control } = useFormContext();
    const id = useId();

    return (
      <Controller
        control={control}
        name={name}
        rules={rules instanceof Vld ? rules.build() : rules}
        render={({
          field: { onChange: controlChangeValue, value = '', ref, ...field },
          fieldState,
        }) => {
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            let currentValue = e.target.value;

            controlChangeValue(currentValue);
            onChange?.(name, currentValue);
          };

          const handleClear = () => {
            controlChangeValue('');
            onChange?.(name, '');
          };

          return (
            <div className="flex flex-col gap-y-1">
              {label && (
                <label htmlFor={id} className="text-xl">
                  {label}
                  {props.required && (
                    <span className="text-red-600 text-2xl">*</span>
                  )}
                </label>
              )}
              <div className="relative">
                <input
                  {...field}
                  {...props}
                  id={id}
                  ref={mergeRefs([ref, forwardedRef])}
                  value={value}
                  onChange={handleChange}
                  aria-invalid={!!fieldState.error}
                  className={cn(
                    'py-[17px] px-7 text-[16px] leading-none font-light border-gray-200 border-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500',
                    fieldState.error &&
                      'border-red-600 text-red-600 placeholder:text-red-600',
                  )}
                />

                {hasClear && value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14px"
                      height="14px"
                      viewBox="-0.5 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M3 21.32L21 3.32001"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 3.32001L21 21.32"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {fieldState.error?.message && (
                <div className="error-message">
                  <span className="text-xs text-red-600">
                    {fieldState.error.message}
                  </span>
                </div>
              )}
            </div>
          );
        }}
      />
    );
  },
);
