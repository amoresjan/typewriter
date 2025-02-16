import React from "react";
import { TypingState } from "../types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type NewsContentProps = {
  state: TypingState;
  handleOnKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
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
      <p className="columns-2 gap-4 text-justify leading-tight">
        {wordsList.map((word, wordIndex) => {
          // Fully typed words are displayed in black
          if (wordIndex < currentWordIndex) {
            return (
              <span key={wordIndex} className="text-black">
                {word}{" "}
              </span>
            );
          }

          // Current word being typed
          if (wordIndex === currentWordIndex) {
            return (
              <span key={wordIndex}>
                {word.split("").map((letter, letterIndex) => {
                  const isCurrentLetter = letterIndex === typedWord.length;
                  const isIncorrect =
                    typedWord[letterIndex] && typedWord[letterIndex] !== letter;
                  const isNotTypedYet = letterIndex >= typedWord.length;

                  return (
                    <span
                      key={letterIndex}
                      className={twMerge(
                        clsx(
                          isCurrentLetter && "bg-black text-white",
                          isIncorrect &&
                            "bg-red-400 text-white decoration-red-400",
                          isNotTypedYet ? "text-gray-300" : "text-black",
                        ),
                      )}
                    >
                      {letter}
                    </span>
                  );
                })}
                {/* Handles overtyped characters (extra incorrect input) */}
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
          }

          // Future words that have not been typed yet
          return (
            <span key={wordIndex} className="text-gray-300">
              {word}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default NewsContent;
