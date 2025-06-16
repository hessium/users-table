import { useEffect, useRef, useState } from "react";
import { useHomePage } from "../home/use-home-page.ts";
import { Spinner } from "../../shared/ui/spinner/spinner.tsx";
import type { User } from "../../shared/types/globals.ts";
import { cn } from "../../shared/utils/cn.ts";

interface UserSelectProps {
  value?: number | null;
  onChange: (userId: number | null) => void;
  disabledIds?: number[];
  onAddUser?: () => void;
  label?: string;
}

export const UserSelect = ({
  value,
  onChange,
  disabledIds = [],
  onAddUser,
  label = "Пользователь",
}: UserSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    allUsers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomePage();

  const filteredUsers = search
    ? allUsers
        .filter((u): u is User => u !== undefined && u !== null)
        .filter(
          (u) =>
            u.first_name.toLowerCase().includes(search.toLowerCase()) ||
            u.last_name.toLowerCase().includes(search.toLowerCase()),
        )
    : allUsers.filter((u): u is User => u !== undefined && u !== null);

  const hasExactMatch = search
    ? filteredUsers.some(
        (u) =>
          u.first_name.toLowerCase() === search.toLowerCase() ||
          u.last_name.toLowerCase() === search.toLowerCase(),
      )
    : false;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open || !hasNextPage || isFetchingNextPage) return;
    const handleScroll = () => {
      const el = listRef.current;
      if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        fetchNextPage();
      }
    };
    const el = listRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (!newValue) {
      onChange(null);
    }
  };

  const handleUserSelect = (user: User) => {
    if (!disabledIds.includes(user.id)) {
      onChange(user.id);
      setOpen(false);
      setSearch("");
      inputRef.current?.blur();
    }
  };

  const handleInputClick = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const selectedUser = value ? allUsers.find((u) => u.id === value) : null;

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-primary">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "py-[17px] px-7 text-[16px] leading-none font-light border-gray-200 border-1 rounded-md w-full",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "cursor-pointer hover:border-primary transition-colors",
            isLoading && "opacity-50 cursor-not-allowed",
          )}
          value={
            open || !value
              ? search
              : selectedUser
                ? `${selectedUser.last_name} ${selectedUser.first_name}`
                : ""
          }
          disabled={isLoading}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder="Выберите пользователя"
          onFocus={() => setOpen(true)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          ▼
        </span>
        {open && (
          <div
            ref={listRef}
            className={cn(
              "absolute z-20 bg-white rounded-2xl shadow-modal mt-2 w-full max-h-72 overflow-y-auto",
              "border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary",
            )}
          >
            {isLoading && <Spinner />}
            {filteredUsers.map((user: User) => {
              const isDisabled = disabledIds.includes(user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2",
                    "transition-colors duration-200",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    !isDisabled && "hover:bg-primary/5",
                  )}
                  onClick={() => handleUserSelect(user)}
                  disabled={isDisabled}
                >
                  {user.last_name} {user.first_name}
                </button>
              );
            })}
            {!hasExactMatch && search && (
              <button
                type="button"
                className={cn(
                  "w-full text-left px-4 py-2 text-green-600",
                  "hover:bg-green-50 transition-colors duration-200",
                )}
                onClick={() => {
                  setOpen(false);
                  setSearch("");
                  onAddUser?.();
                }}
              >
                + Добавить "{search}"
              </button>
            )}
            {isFetchingNextPage && <Spinner />}
            {!filteredUsers.length && !isLoading && (
              <div className="px-4 py-2 text-gray-400">Нет пользователей</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
