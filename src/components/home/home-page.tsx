import { useHomePage } from "./use-home-page.ts";
import { Spinner } from "../../shared/ui/spinner/spinner.tsx";
import type { User } from "../../shared/types/globals.ts";
import { columns } from "../../shared/constants/users-table.ts";
import { Table } from "../../shared/ui/table/table";
import { useInView } from "react-intersection-observer";
import { Modal } from "../../shared/ui/modal/modal";
import { EditUserForm } from "../../components/edit-user/edit-user-form";
import { useEffect, useState } from "react";
import { UserForm } from "../../components/user-form/user-form";
import { useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../shared/api/user-api";
import { Button } from "../../shared/ui/button/button";
import { toaster } from "../../shared/ui/sonner/sonner";

export const HomePage = () => {
  const {
    allUsers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    isDeleting,
    handleEditSubmit,
    handleDeleteConfirm,
  } = useHomePage();

  const { ref, inView } = useInView();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreateUser = async (data: any) => {
    try {
      await userApi.create(data);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowCreateModal(false);
      toaster("Пользователь успешно создан", "success");
    } catch (e) {
      toaster("Ошибка при создании пользователя", "error");
    }
  };

  const handleEditSubmitWithToast = async (data: Partial<User>) => {
    try {
      await handleEditSubmit(data);
      toaster("Пользователь успешно обновлён", "success");
    } catch (e) {
      toaster("Ошибка при обновлении пользователя", "error");
    }
  };

  const handleDeleteConfirmWithToast = async () => {
    try {
      await handleDeleteConfirm();
      toaster("Пользователь успешно удалён", "success");
    } catch (e) {
      toaster("Ошибка при удалении пользователя", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Таблица пользователей</h1>
      <Button className="mb-4" onClick={() => setShowCreateModal(true)}>
        Добавить пользователя
      </Button>

      {isLoading && <Spinner />}

      {allUsers.length > 0 && (
        <>
          <div className="">
            <Table<User>
              data={allUsers}
              getRowId={(user) => user.id}
              columns={columns}
              onEdit={setEditingUser}
              onDelete={setDeletingUser}
            />
          </div>

          <div ref={ref} className="h-10 flex items-center justify-center mt-4">
            {isFetchingNextPage && <Spinner />}
          </div>
        </>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Добавить пользователя"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateModal(false)}
          addedUserIds={[]}
          mode="create"
        />
      </Modal>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Редактировать пользователя"
      >
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onSubmit={handleEditSubmitWithToast}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Удалить пользователя"
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDeleteConfirmWithToast}
        actionsBtn={true}
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        showConfirmLoader={isDeleting}
      >
        <p className="text-lg">
          Вы уверены, что хотите удалить пользователя {deletingUser?.first_name}{" "}
          {deletingUser?.last_name}?
        </p>
      </Modal>
    </div>
  );
};
