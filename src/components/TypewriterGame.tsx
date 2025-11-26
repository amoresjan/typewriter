import React, { useCallback, useEffect, useState } from "react";
import NewsContent from "./NewsContent";
import Header from "./Header";
import NewsHeader from "./NewsHeader";
import { NEWS_CONTENT_MOCK } from "../mocks/NewsContentMock";
import { GameProvider, useGameDispatch } from "../context/GameContext";
import { News } from "../types";
import Loading from "./Loading";

const GameLayout: React.FC<{ news: News }> = ({ news }) => {
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
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setNews(NEWS_CONTENT_MOCK);
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading || !news) {
    return <Loading />;
  }

  return (
    <GameProvider news={news}>
      <GameLayout news={news} />
    </GameProvider>
  );
};

export default TypewriterGame;
