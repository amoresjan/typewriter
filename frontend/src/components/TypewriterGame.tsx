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

interface GameLayoutProps {
  news: News;
  onDateSelect: (date: string | undefined) => void;
}

const GameLayout: React.FC<GameLayoutProps> = ({ news, onDateSelect }) => {
  const dispatch = useGameDispatch();

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "SUBMIT_WORD" });
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
      <Header date={news.date} onDateSelect={onDateSelect} />
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

interface TypewriterGameProps {
  selectedDate: string | undefined;
  onDateSelect: (date: string | undefined) => void;
}

const TypewriterGame: React.FC<TypewriterGameProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const { data: news, isLoading, isError, error } = useNews(selectedDate);

  if (isLoading || !news) return <Loading />;

  if (isError) {
    const msg = error instanceof Error ? error.message : "";
    if (selectedDate && msg === "No article for this date") {
      return (
        <div className="flex flex-1 items-center justify-center font-sans text-attribution">
          No article available for this date.
        </div>
      );
    }
    return (
      <GameProvider news={NEWS_CONTENT_MOCK}>
        <GameLayout news={NEWS_CONTENT_MOCK} onDateSelect={onDateSelect} />
      </GameProvider>
    );
  }

  return (
    <GameProvider news={news}>
      <GameLayout news={news} onDateSelect={onDateSelect} />
    </GameProvider>
  );
};

export default TypewriterGame;
