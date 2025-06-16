import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../spinner/spinner';
import type { User } from '../../types/globals.ts';
import { useHomePage } from '../../../pages/home/use-home-page';
import { cn } from '../../utils/cn';

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
  label = 'Пользователь',
}: UserSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { allUsers, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useHomePage();

  const filteredUsers = search
    ? allUsers
        .filter((u): u is User => u !== undefined && u !== null)
        .filter((u) => 
          u.first_name.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name.toLowerCase().includes(search.toLowerCase())
        )
    : allUsers.filter((u): u is User => u !== undefined && u !== null);

  const hasExactMatch = search
    ? filteredUsers.some(
        (u) => 
          u.first_name.toLowerCase() === search.toLowerCase() ||
          u.last_name.toLowerCase() === search.toLowerCase()
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
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (!newValue) {
      onChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-primary">{label}</label>
      <div className="relative" tabIndex={0}>
        <input
          type="text"
          className={cn(
            "py-[17px] px-7 text-[16px] leading-none font-light border-gray-200 border-1 rounded-md w-full",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "cursor-pointer hover:border-primary transition-colors",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          value={
            open || !value
              ? search
              : (() => {
                  const user = allUsers.find((u) => u.id === value);
                  return user ? `${user.last_name} ${user.first_name}` : '';
                })()
          }
          disabled={isLoading}
          onChange={handleInputChange}
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
              "border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          >
            {isLoading && <Spinner />}
            {filteredUsers.map((user) => {
              const disabled = disabledIds.includes(user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2",
                    "transition-colors duration-200",
                    disabled && "opacity-50 cursor-not-allowed",
                    !disabled && "hover:bg-primary/5"
                  )}
                  onClick={() => {
                    if (!disabled) {
                      onChange(user.id);
                      setOpen(false);
                      setSearch('');
                    }
                  }}
                  disabled={disabled}
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
                  "hover:bg-green-50 transition-colors duration-200"
                )}
                onClick={() => {
                  setOpen(false);
                  setSearch('');
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
