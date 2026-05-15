import React from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  overlayClassName?: string;
  onClickOverlay?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  overlayClassName,
  onClickOverlay,
  ...contentProps
}) => {
  return (
    <div
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        overlayClassName,
      )}
      onClick={onClickOverlay}
    >
      <div
        className={twMerge(
          "rounded-lg border-2 border-ink bg-paper p-8 text-center shadow-[4px_4px_0px_0px_#0f0e0c]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...contentProps}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
