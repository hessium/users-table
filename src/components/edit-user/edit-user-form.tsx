import { Form } from '../../containers/form/form.tsx';
import { Input } from '../../shared/ui/input/input.tsx';
import { Button } from '../../shared/ui/button/button.tsx';
import { vld } from '../../shared/utils/form-validator.ts';
import type { User } from '../../shared/types/globals.ts';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePickerField } from '../../shared/ui/date-picker-field/date-picker-field.tsx';

interface EditUserFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

interface EditUserFormFields extends Partial<User> {
  gender?: 'male' | 'female';
}

export const EditUserForm = ({ user, onSubmit }: EditUserFormProps) => {
  const methods = useForm<EditUserFormFields>({
    defaultValues: {
      ...user,
    },
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit}>
        {({ isValid }) => (
          <div className="flex flex-col gap-4">
            <Input
              name="first_name"
              label="Имя"
              rules={vld().required('Имя').build()}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 md:w-1/2 w-full">
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
                className="md:w-1/2 w-full"
              />
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4">Образование</h3>
              <div className="flex flex-col gap-4">
                <Input
                  name="education.university"
                  label="Вуз"
                  rules={vld().required('Укажите вуз').build()}
                  placeholder="Выберите ВУЗ"
                />
                <DatePickerField
                  control={methods.control}
                  name="education.graduation_year"
                  label="Год окончания"
                  required
                  minYear={1950}
                  maxYear={new Date().getFullYear() as number}
                  mode="year"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4">Работа</h3>
              <div className="flex flex-col gap-4">
                <Input
                  name="work.company"
                  label="Место работы"
                  rules={vld().required('Укажите место работы').build()}
                  placeholder="Место работы"
                />
                <div className="flex flex-col gap-2">
                  <textarea
                    {...methods.register('work.responsibilities')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Должностные обязанности"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center mt-4">
              <Button
                type="submit"
                className="min-w-[180px] h-[56px]"
                disabled={!isValid}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      </Form>
    </FormProvider>
  );
};
