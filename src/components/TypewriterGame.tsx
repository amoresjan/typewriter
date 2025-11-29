import React, { useCallback, useEffect, useState } from "react";
import NewsContent from "./NewsContent";
import Header from "./Header";
import NewsHeader from "./NewsHeader";
import GameCompletion from "./GameCompletion";
import { NEWS_CONTENT_MOCK } from "../mocks/NewsContentMock";
import {
  GameProvider,
  useGameDispatch,
  useGameState,
} from "../context/GameContext";
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

  const state = useGameState();
  const isGameFinished = state.currentWordIndex >= state.wordsList.length;

  return (
    <article className="mx-auto w-full max-w-5xl flex-1 px-12 pt-6">
      <Header date={news.date} />
      <NewsHeader news={news} />
      <NewsContent handleOnKeyDown={handleOnKeyDown} />
      {isGameFinished && (
        <GameCompletion
          wpm={state.wpm}
          accuracy={state.accuracy}
          totalErrors={state.totalErrors}
          newsTitle={news.title}
          onRestart={() => window.location.reload()}
        />
      )}
    </article>
  );
};

const TypewriterGame: React.FC = () => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (import.meta.env.DEV) {
        console.log("Local development detected. Using mock data.");
        setNews(NEWS_CONTENT_MOCK);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "https://typewriter-api-production.up.railway.app/api/news/",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        // The API returns a list, we take the first item for now
        if (data && data.length > 0) {
          setNews(data[0]);
        } else {
          // Fallback to mock if no news found (optional, or handle error)
          setNews(NEWS_CONTENT_MOCK);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews(NEWS_CONTENT_MOCK);
      } finally {
        setLoading(false);
      }
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
