import React from "react";
import Word from "@components/news/Word";

interface WordsProps {
  currentWordIndex: number;
  typedWord: string;
  wordsList: string[];
}

const Words: React.FC<WordsProps> = ({
  currentWordIndex,
  typedWord,
  wordsList,
}) => {
  return (
    <p className="columns-2 gap-8 text-justify text-base leading-[1.625] break-words text-ink [column-rule:1px_solid_var(--color-ash-border)]">
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

export default Words;
