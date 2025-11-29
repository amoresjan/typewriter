import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { CursorArrowIcon } from "@radix-ui/react-icons";
import { useGameState } from "../context/GameContext";
import Modal from "./common/Modal";
import NeoButton from "./common/NeoButton";

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
    <p className="columns-2 gap-4 text-justify text-xl leading-tight break-words">
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

const CurrentWord: React.FC<{ word: string; typedWord: string }> = React.memo(
  ({ word, typedWord }) => {
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
  },
);

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
          isCurrentLetter && "cursor-blink bg-black text-white",
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
          <Modal
            className="border-none bg-transparent p-0 shadow-none"
            overlayClassName="absolute z-10 bg-black/5 backdrop-blur-[1px]"
            onClickOverlay={handleOverlayClick}
          >
            <NeoButton
              onClick={handleOverlayClick}
              variant="secondary"
              icon={<CursorArrowIcon />}
              className="font-helvetica text-sm font-medium"
            >
              Click here or press any key to focus
            </NeoButton>
          </Modal>
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
