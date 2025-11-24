import React from "react";
import { TypingState } from "../types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type NewsContentProps = {
  state: TypingState;
  handleOnKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const Word: React.FC<{
  word: string;
  isTyped: boolean;
  isCurrent: boolean;
  typedWord: string;
}> = ({ word, isTyped, isCurrent, typedWord }) => {
  if (isTyped) return <TypedWord word={word} />;
  if (isCurrent) return <CurrentWord word={word} typedWord={typedWord} />;
  return <UntypedWord word={word} />;
};

const Words: React.FC<{
  currentWordIndex: number;
  typedWord: string;
  wordsList: string[];
}> = ({
  currentWordIndex,
  typedWord,
  wordsList,
}) => {
    return (
      <p className="columns-2 gap-4 text-justify leading-tight">
        {wordsList.map((word, wordIndex) => (
          <Word
            key={wordIndex}
            word={word}
            isTyped={wordIndex < currentWordIndex}
            isCurrent={wordIndex === currentWordIndex}
            typedWord={typedWord}
          />
        ))}
      </p>
    );
  };

const TypedWord: React.FC<{ word: string }> = ({ word }) => {
  return <span className="text-black">{word} </span>;
};

const CurrentWord: React.FC<{ word: string; typedWord: string }> = ({
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
};

const UntypedWord: React.FC<{ word: string }> = ({ word }) => {
  return <span className="text-gray-300">{word} </span>;
};

const Letter: React.FC<{
  letter: string;
  typedLetter?: string;
  isCurrentLetter: boolean;
  isIncorrect: boolean;
}> = ({ letter, typedLetter, isCurrentLetter, isIncorrect }) => {
  return (
    <span
      className={twMerge(
        clsx(
          isCurrentLetter && "bg-black text-white",
          isIncorrect && "bg-red-400 text-white decoration-red-400",
          !typedLetter ? "text-gray-300" : "text-black",
        ),
      )}
    >
      {letter}
    </span>
  );
};

const NewsContent: React.FC<NewsContentProps> = ({
  state,
  handleOnKeyDown,
}) => {
  const { currentWordIndex, typedWord, wordsList } = state;
  return (
    <div
      className="mt-4 grid outline-none"
      tabIndex={0}
      onKeyDown={handleOnKeyDown}
    >
      <Words
        wordsList={wordsList}
        currentWordIndex={currentWordIndex}
        typedWord={typedWord}
      />
    </div>
  );
};

export default NewsContent;
