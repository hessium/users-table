import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/button';
import { vld } from '../../shared/utils/form-validator';
import { DatePickerField } from '../../shared/ui/date-picker-field/date-picker-field';

interface UserCreateFormFields {
  first_name: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female';
  role: 'doctor' | 'nurse' | 'admin';
  birth_date: Date;
}

interface UserCreateFormProps {
  onSubmit: (data: UserCreateFormFields) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserCreateForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
}: UserCreateFormProps) => {
  const methods = useForm<UserCreateFormFields>({
    mode: 'onBlur',
  });

  const handleFormSubmit = methods.handleSubmit(
    async (data) => {
      try {
        await onSubmit(data);
        onCancel();
      } catch (error) {}
    },
    (errors) => {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const field = document.querySelector(
          `[name="${firstError}"]`,
        ) as HTMLElement;
        field?.focus();
      }
    },
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <Input
          name="first_name"
          label="Имя"
          rules={vld().required('Имя').build()}
        />

        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-primary"
            >
              Пол <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              {...methods.register('gender', { required: 'Выберите пол' })}
              className="py-[17px] px-7 text-[16px] leading-none font-light border-gray-200 border-1 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Выберите пол
              </option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
            {methods.formState.errors.gender && (
              <span className="text-xs text-red-500 mt-1">
                {methods.formState.errors.gender.message as string}
              </span>
            )}
          </div>
          <DatePickerField
            control={methods.control}
            name="birth_date"
            label="Дата рождения"
            required
            className="w-1/2"
          />
        </div>
        <div>
          <h3 className="text-2xl font-medium mb-4">Роль</h3>
          <select
            {...methods.register('role', { required: 'Выберите роль' })}
            className="py-[17px] px-7 text-[16px] leading-none font-light border-gray-200 border-1 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Выберите роль
            </option>
            <option value="doctor">Доктор</option>
            <option value="nurse">
              {methods.watch('gender') === 'male'
                ? 'Медбрат'
                : methods.watch('gender') === 'female'
                  ? 'Медсестра'
                  : 'Медсестра/Медбрат'}
            </option>
            <option value="admin">Админ</option>
          </select>
          {methods.formState.errors.role && (
            <span className="text-xs text-red-500 mt-1">
              {methods.formState.errors.role.message as string}
            </span>
          )}
        </div>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            isLoading={isLoading}
            type="submit"
            className="min-w-[180px] h-[56px]"
            disabled={isLoading}
          >
            Добавить
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="min-w-[120px] h-[56px]"
            disabled={isLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
