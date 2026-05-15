import React, { useCallback, useEffect, useRef, useState } from "react";

interface ToastProps {
  title: string;
  description?: string;
  onDismiss: () => void;
  duration?: number;
}

// Keep in sync with slide-out animation duration in index.css
const SLIDE_DURATION_MS = 250;

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  onDismiss,
  duration = 5000,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  // Always-fresh ref prevents inline arrow at usage site from resetting timers
  // on every parent re-render (WPM interval fires every 1s)
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const isDismissingRef = useRef(false);
  const triggerDismiss = useCallback(() => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    setIsLeaving(true);
    setTimeout(() => onDismissRef.current(), SLIDE_DURATION_MS);
  }, []);

  useEffect(() => {
    const timer = setTimeout(triggerDismiss, duration - SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [duration, triggerDismiss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-16 right-4 z-50 w-80 rounded-lg border-2 border-ink bg-paper p-4 font-sans shadow-[4px_4px_0px_0px_#0f0e0c] ${
        isLeaving ? "animate-slide-out" : "animate-slide-in"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-ink">{title}</span>
          {description && (
            <span className="mt-2 border-t border-ash-border pt-2 text-sm text-attribution">
              {description}
            </span>
          )}
        </div>
        <button
          onClick={triggerDismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-0.5 shrink-0 p-1 text-base leading-none text-attribution transition-colors hover:text-ink active:opacity-60 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
