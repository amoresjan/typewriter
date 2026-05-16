import React, { useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  overlayClassName?: string;
  onClickOverlay?: () => void;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  overlayClassName,
  onClickOverlay,
  onClose,
  ...contentProps
}) => {
  useEffect(() => {
    if (!onClose) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        overlayClassName,
      )}
      onClick={onClickOverlay}
    >
      <div
        className={twMerge(
          "relative rounded-lg border-2 border-ink bg-paper p-8 text-center shadow-[4px_4px_0px_0px_#0f0e0c]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...contentProps}
      >
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center text-attribution transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          >
            <Cross2Icon />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
