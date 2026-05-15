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
    "flex items-center justify-center gap-2 rounded-md border-2 border-ink px-4 py-3 font-sans text-sm font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2";

  const variants = {
    primary:
      "bg-ink text-paper hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]",
    secondary:
      "bg-paper text-ink hover:bg-ghost hover:shadow-[2px_2px_0px_0px_#0f0e0c]",
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
