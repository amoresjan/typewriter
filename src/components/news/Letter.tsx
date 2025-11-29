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
            isCurrentLetter && "cursor-blink bg-black text-white",
            isIncorrect && "bg-red-400 text-white decoration-red-400",
            !typedLetter ? "text-gray-300" : "text-black",
          ),
        )}
      >
        {letter}
      </span>
    );
  },
);

export default Letter;
