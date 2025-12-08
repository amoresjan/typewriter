import React, { useEffect, useState } from "react";

interface ToastProps {
  title: string;
  description?: string;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  onDismiss,
  duration = 5000,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Start exit animation before dismissing
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300); // Start animation 300ms before dismiss

    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss, duration]);

  return (
    <div
      className={`fixed bottom-16 right-4 z-50 w-80 rounded-lg border-2 border-black bg-white p-4 font-sans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
        isLeaving ? "animate-slide-out" : "animate-slide-in"
      }`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{title}</span>
        {description && (
          <span className="text-sm text-gray-600">{description}</span>
        )}
      </div>
    </div>
  );
};

export default Toast;

