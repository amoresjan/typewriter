import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  className,
  variant = "primary",
  icon,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-md border-2 border-black px-4 py-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none";

  const variants = {
    primary:
      "bg-black text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]",
    secondary:
      "bg-white text-black hover:bg-gray-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default NeoButton;
