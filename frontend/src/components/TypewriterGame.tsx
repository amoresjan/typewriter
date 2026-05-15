import React, { useCallback } from "react";
import NewsContent from "./NewsContent";
import Header from "./Header";
import NewsHeader from "./NewsHeader";
import GameCompletion from "./GameCompletion";
import Toast from "./common/Toast";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { GameProvider } from "@context/GameProvider";
import { useGameDispatch, useGameState } from "@context/GameContext";
import { News } from "@app-types";
import Loading from "./Loading";
import { useNews } from "@hooks/useNews";

const GameLayout: React.FC<{ news: News }> = ({ news }) => {
  const dispatch = useGameDispatch();

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Ignore if any modifier key is pressed (Ctrl, Meta, Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        dispatch({
          type: "SUBMIT_WORD",
        });
      } else if (e.key === "Backspace") {
        dispatch({ type: "DELETE_LETTER" });
      } else if (e.key.length === 1) {
        dispatch({ type: "TYPE_LETTER", letter: e.key });
      }
    },
    [dispatch],
  );

  const state = useGameState();
  const isGameFinished = state.currentWordIndex >= state.wordsList.length;

  return (
    <article className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col overflow-hidden px-12 pt-6">
      <Header date={news.date} />
      <NewsHeader news={news} />
      <NewsContent handleOnKeyDown={handleOnKeyDown} />
      {state.showAfkToast && (
        <Toast
          title="AFK Detected"
          description="WPM has been readjusted to your last active typing speed."
          onDismiss={() => dispatch({ type: "DISMISS_AFK_TOAST" })}
        />
      )}
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
  const { data: news, isLoading: loading, isError } = useNews();

  if (loading || !news) {
    return <Loading />;
  }

  if (isError) {
    // Fallback to mock on error after retries
    return (
      <GameProvider news={NEWS_CONTENT_MOCK}>
        <GameLayout news={NEWS_CONTENT_MOCK} />
      </GameProvider>
    );
  }

  return (
    <GameProvider news={news}>
      <GameLayout news={news} />
    </GameProvider>
  );
};

export default TypewriterGame;
