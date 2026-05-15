import React, { useState, useRef, useEffect } from "react";
import NewsText from "@components/news/NewsText";

type NewsContentProps = {
  handleOnKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const NewsContent: React.FC<NewsContentProps> = React.memo(
  ({ handleOnKeyDown }) => {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      containerRef.current?.focus();
    }, []);

    useEffect(() => {
      const handleGlobalKeyDown = () => {
        if (!isFocused && containerRef.current) {
          containerRef.current.focus();
        }
      };

      if (!isFocused) {
        window.addEventListener("keydown", handleGlobalKeyDown);
      }

      return () => {
        window.removeEventListener("keydown", handleGlobalKeyDown);
      };
    }, [isFocused]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleOverlayClick = () => {
      containerRef.current?.focus();
    };

    return (
      <div
        className="relative mt-4 flex h-full flex-1 cursor-pointer flex-col overflow-hidden"
        onClick={!isFocused ? handleOverlayClick : undefined}
      >
        {!isFocused && (
          <p className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center italic text-sm text-ink">
            press any key to begin
          </p>
        )}
        <div
          ref={containerRef}
          className={`grid overflow-hidden outline-none transition-opacity duration-200 ${!isFocused ? "opacity-20" : "opacity-100"}`}
          tabIndex={0}
          onKeyDown={handleOnKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <NewsText />
        </div>
      </div>
    );
  },
);

export default NewsContent;
