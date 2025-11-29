import React from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  onClickOverlay?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  overlayClassName,
  onClickOverlay,
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
          "rounded-lg border-2 border-black bg-white p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
