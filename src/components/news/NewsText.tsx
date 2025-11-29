import React from "react";
import { useGameState } from "@context/GameContext";
import Words from "@components/news/Words";

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

export default NewsText;
