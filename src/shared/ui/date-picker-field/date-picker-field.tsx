import { useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';
import { cn } from '../../utils/cn';

import styles from './date-picker-field.module.css';

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  className?: string;
  mode?: 'date' | 'year';
}

export function DatePickerField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  placeholder = 'дд.мм.гггг',
  className = '',
  mode = 'date',
}: DatePickerFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatValue = (value: Date | number | undefined) => {
    if (mode === 'year') {
      if (!value) return '';
      if (typeof value === 'number') return value.toString();
      if (value instanceof Date) return value.getFullYear().toString();
      return '';
    }
    return value && value instanceof Date ? format(value, 'dd.MM.yyyy') : '';
  };

  return (
    <div className={cn('flex flex-col gap-2 relative', className)}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: 'Дата обязательна' } : undefined}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className={cn(
                  'py-[17px] px-7 text-[16px] leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 border-1 rounded-md w-full cursor-pointer',
                  fieldState.error && 'border-red-500'
                )}
                value={formatValue(field.value)}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                readOnly
                placeholder={mode === 'year' ? 'ГГГГ' : placeholder}
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setOpen((v) => !v)}
                tabIndex={-1}
                aria-label="Открыть календарь"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10m-13 8V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                  />
                </svg>
              </button>
            </div>
            {open && mode === 'date' && (
              <div className={styles.dropdownCalendar}>
                <DayPicker
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  locale={ru}
                  fromYear={minYear}
                  toYear={maxYear}
                  captionLayout="dropdown"
                />
              </div>
            )}
            {open && mode === 'year' && (
              <div className={styles.dropdownCalendar}>
                <div className="flex flex-col max-h-60 overflow-y-auto p-2">
                  {Array.from(
                    { length: maxYear - minYear + 1 },
                    (_, i) => maxYear - i,
                  ).map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={cn(
                        'text-left px-3 py-1 rounded hover:bg-blue-100',
                        field.value === year && 'bg-blue-500 text-white'
                      )}
                      onClick={() => {
                        field.onChange(year);
                        setOpen(false);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {fieldState.error && (
              <span className="text-xs text-red-500 mt-1">
                {fieldState.error.message}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
}
