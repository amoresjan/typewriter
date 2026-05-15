import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface LetterProps {
  letter: string;
  typedLetter?: string;
  isCurrentLetter: boolean;
  isIncorrect: boolean;
}

const Letter: React.FC<LetterProps> = React.memo(
  ({ letter, typedLetter, isCurrentLetter, isIncorrect }) => {
    return (
      <span
        className={twMerge(
          clsx(
            isCurrentLetter && "cursor-blink bg-ink text-paper",
            isIncorrect && "bg-press-red text-paper",
            !isCurrentLetter &&
              !isIncorrect &&
              (!typedLetter ? "text-ash-muted" : "text-ink"),
          ),
        )}
      >
        {letter}
      </span>
    );
  },
);

export default Letter;
