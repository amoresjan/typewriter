import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { CursorArrowIcon } from "@radix-ui/react-icons";
import NeoButton from "@components/common/NeoButton";

type NewsContentProps = {
  handleOnKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

import NewsText from "@components/news/NewsText";

const NewsContent: React.FC<NewsContentProps> = React.memo(
  ({ handleOnKeyDown }) => {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Auto-focus on mount
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
      <div className="relative mt-4 flex h-full flex-1 flex-col overflow-hidden">
        {!isFocused && (
          <div
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center transition-all duration-200"
            onClick={handleOverlayClick}
          >
            
            <NeoButton
              onClick={handleOverlayClick}
              variant="secondary"
              icon={<CursorArrowIcon />}
              className="font-sans text-sm font-medium"
            >
              Click here or press any key to focus
            </NeoButton>
          </div>
        )}
        <div
          ref={containerRef}
          className={twMerge(
            "grid overflow-hidden transition-all duration-200 outline-none",
            !isFocused && "blur-[1.5px] filter",
          )}
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
