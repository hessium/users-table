import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../shared/ui/button/button';
import { DatePickerField } from '../../shared/ui/date-picker-field/date-picker-field';
import { UserSelect } from '../../shared/ui/user-select/user-select';
import type { User } from '../../shared/types/globals';
import { Modal } from '../../shared/ui/modal/modal';
import { UserCreateForm } from './user-create-form';
import { userApi } from '../../shared/api/user-api';
import { useQueryClient } from '@tanstack/react-query';
import { toaster } from '../../shared/ui/sonner/sonner';

interface UserFormFields extends Partial<User> {
  gender?: 'male' | 'female';
  role?: 'doctor' | 'nurse' | 'admin';
}

interface UserFormProps {
  initialValues?: Partial<User>;
  onSubmit: (data: UserFormFields) => void;
  onCancel: () => void;
  addedUserIds?: number[];
  mode?: 'create' | 'edit';
}

export const UserForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  addedUserIds = [],
  mode = 'create',
}: UserFormProps) => {
  const methods = useForm<UserFormFields>({
    defaultValues: initialValues,
    mode: 'onBlur',
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const queryClient = useQueryClient();

  const handleUserChange = (userId: number | null) => {
    methods.setValue('id', userId ?? undefined);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleUserCreated = async (data: any) => {
    try {
      setIsCreatingUser(true);
      const created = await userApi.create(data);

      await queryClient.invalidateQueries({ queryKey: ['users'] });

      methods.setValue('id', Number(created.data.id));
      setShowAddUserModal(false);
      toaster('Пользователь успешно создан', 'success');
      onCancel();
    } catch (e) {
      toaster('Ошибка при создании пользователя', 'error');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleFormSubmit = methods.handleSubmit(
    async (data) => {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
        toaster(
          mode === 'edit' ? 'Пользователь успешно обновлен' : 'Пользователь успешно добавлен',
          'success'
        );
      } catch (error) {
        toaster('Произошла ошибка при сохранении', 'error');
      } finally {
        setIsSubmitting(false);
      }
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
        <UserSelect
          value={methods.watch('id') as number}
          onChange={handleUserChange}
          disabledIds={addedUserIds}
          onAddUser={handleAddUser}
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
            type="submit" 
            className="min-w-[180px] h-[56px]"
            isLoading={isSubmitting}
          >
            {mode === 'edit' ? 'Сохранить' : 'Добавить'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="min-w-[120px] h-[56px]"
            disabled={isSubmitting}
          >
            Отмена
          </Button>
        </div>

        <Modal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          title="Добавить пользователя"
        >
          <UserCreateForm
            onSubmit={handleUserCreated}
            onCancel={() => setShowAddUserModal(false)}
            isLoading={isCreatingUser}
          />
        </Modal>
      </form>
    </FormProvider>
  );
};
