import React from "react";
import Letter from "@components/news/Letter";

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

export default Word;
