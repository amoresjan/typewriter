import React, { useCallback } from "react";
import NewsContent from "./NewsContent";
import Header from "./Header";
import NewsHeader from "./NewsHeader";
import { NEWS_CONTENT_MOCK } from "../mocks/NewsContentMock";
import { GameProvider, useGameDispatch } from "../context/GameContext";

const GameLayout: React.FC = () => {
  const news = NEWS_CONTENT_MOCK;
  const dispatch = useGameDispatch();

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === " " || e.key === "Enter") {
        dispatch({
          type: "SUBMIT_WORD",
        });
      } else if (e.key === "Backspace") {
        dispatch({ type: "DELETE_LETTER" });
      } else if (e.key.length === 1) {
        dispatch({ type: "TYPE_LETTER", letter: e.key });
      }
      if (e.key === " ") e.preventDefault();
    },
    [dispatch],
  );

  return (
    <article className="mx-auto w-full max-w-5xl flex-1 px-12 pt-6">
      <Header />
      <NewsHeader news={news} />
      <NewsContent handleOnKeyDown={handleOnKeyDown} />
    </article>
  );
};

const TypewriterGame: React.FC = () => {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
};

export default TypewriterGame;
