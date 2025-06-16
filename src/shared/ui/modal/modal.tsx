import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button/button';
import { Spinner } from '../spinner/spinner';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  actionsBtn?: boolean;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  showConfirmLoader?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actionsBtn = false,
  confirmText = 'Далее',
  cancelText = 'Отменить',
  onConfirm,
  confirmDisabled = false,
  cancelDisabled = false,
  showConfirmLoader = false,
}: ModalProps) => {
  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const root = document.createElement('div');
    root.classList.add('modal-portal-root');
    return root;
  }, []);

  useEffect(() => {
    if (!portalRoot) return;
    document.body.appendChild(portalRoot);
    return () => {
      document.body.contains(portalRoot) &&
        document.body.removeChild(portalRoot);
    };
  }, [portalRoot]);

  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setTimeout(() => setShow(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!show || !portalRoot) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-all duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative bg-white text-black rounded-3xl overflow-hidden shadow-xl w-full max-w-[730px] flex flex-col transition-all duration-300',
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8',
        )}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 md:p-6 flex justify-between items-center rounded-lg sticky top-0 z-10 bg-gray-50">
          <h2 className="flex items-center gap-2 text-4xl font-semibold text-black">
            {title}
          </h2>
          <button
            className={cn(
              'border-0 text-3xl cursor-pointer px-2 transition-all duration-300 ease-in-out leading-none hover:opacity-70 text-black',
            )}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
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
        </div>
        <div
          className="p-6 flex-grow text-black overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 120px)' }}
        >
          <div className="modal__body-content">{children}</div>
        </div>
        {actionsBtn && (
          <div className="px-6 pb-6 flex gap-2 justify-between md:flex-row flex-col-reverse">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full md:w-auto"
              disabled={cancelDisabled}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="w-full md:w-auto"
              disabled={confirmDisabled}
            >
              {showConfirmLoader && (
                <span className="w-5 h-5 mr-2 inline-block align-middle">
                  <Spinner />
                </span>
              )}
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>,
    portalRoot,
  );
};
