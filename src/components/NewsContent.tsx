import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { CursorArrowIcon } from "@radix-ui/react-icons";
import { useGameState } from "../context/GameContext";

type NewsContentProps = {
  handleOnKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const Word: React.FC<{
  word: string;
  isTyped: boolean;
  isCurrent: boolean;
  typedWord?: string;
}> = React.memo(({ word, isTyped, isCurrent, typedWord }) => {
  if (isTyped) return <TypedWord word={word} />;
  if (isCurrent) return <CurrentWord word={word} typedWord={typedWord || ""} />;
  return <UntypedWord word={word} />;
});

const Words: React.FC<{
  currentWordIndex: number;
  typedWord: string;
  wordsList: string[];
}> = ({ currentWordIndex, typedWord, wordsList }) => {
  return (
    <p className="columns-2 gap-4 text-justify leading-tight break-words">
      {wordsList.map((word, wordIndex) => (
        <Word
          key={wordIndex}
          word={word}
          isTyped={wordIndex < currentWordIndex}
          isCurrent={wordIndex === currentWordIndex}
          typedWord={wordIndex === currentWordIndex ? typedWord : undefined}
        />
      ))}
    </p>
  );
};

const TypedWord: React.FC<{ word: string }> = React.memo(({ word }) => {
  return <span className="text-black">{word} </span>;
});

const CurrentWord: React.FC<{ word: string; typedWord: string }> = React.memo(({
  word,
  typedWord,
}) => {
  return (
    <span>
      {word.split("").map((letter, letterIndex) => {
        return (
          <Letter
            key={letterIndex}
            letter={letter}
            typedLetter={typedWord[letterIndex]}
            isCurrentLetter={letterIndex === typedWord.length}
            isIncorrect={Boolean(
              typedWord[letterIndex] && typedWord[letterIndex] !== letter,
            )}
          />
        );
      })}
      {typedWord.length > word.length &&
        typedWord
          .slice(word.length)
          .split("")
          .map((extraChar, extraIndex) => (
            <span
              key={`extra-${extraIndex}`}
              className="bg-red-400 text-white decoration-red-800"
            >
              {extraChar}
            </span>
          ))}{" "}
    </span>
  );
});

const UntypedWord: React.FC<{ word: string }> = React.memo(({ word }) => {
  return <span className="text-gray-300">{word} </span>;
});

const Letter: React.FC<{
  letter: string;
  typedLetter?: string;
  isCurrentLetter: boolean;
  isIncorrect: boolean;
}> = React.memo(({ letter, typedLetter, isCurrentLetter, isIncorrect }) => {
  return (
    <span
      className={twMerge(
        clsx(
          isCurrentLetter && "bg-black text-white cursor-blink",
          isIncorrect && "bg-red-400 text-white decoration-red-400",
          !typedLetter ? "text-gray-300" : "text-black",
        ),
      )}
    >
      {letter}
    </span>
  );
});

const NewsText: React.FC = React.memo(() => {
  const state = useGameState();
  const { currentWordIndex, typedWord, wordsList } = state;

  return (
    <Words
      wordsList={wordsList}
      currentWordIndex={currentWordIndex}
      typedWord={typedWord}
    />
  );
});

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
      <div className="relative mt-4">
        {!isFocused && (
          <div
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center transition-all duration-200"
            onClick={handleOverlayClick}
          >
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-helvetica text-sm font-medium text-gray-600 shadow-sm">
              <CursorArrowIcon />
              <span>Click here or press any key to focus</span>
            </div>
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
