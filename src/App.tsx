"use client";

import { useCallback, useReducer } from "react";
import NewsContent from "./components/NewsContent";
import Header from "./components/Header";
import NewsHeader from "./components/NewsHeader";
import { typingReducer } from "./reducers/TypingReducer";
import { NEWS_CONTENT_MOCK } from "./mocks/NewsContentMock";

export default function Home() {
  const news = NEWS_CONTENT_MOCK;
  const wordsList = news.content.split(/\s+/);

  const [state, dispatch] = useReducer(typingReducer, {
    currentWordIndex: 0,
    typedWord: "",
    wordsList: wordsList,
    activeTime: 0,
    lastKeystrokeTime: null,
    wpm: 0,
    totalCharsTyped: 0,
    totalErrors: 0,
    accuracy: 100,
  });

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
      // Prevent default behavior for some keys if necessary, but usually we want to allow standard keys.
      // e.preventDefault(); // Removing this as it might block standard browser shortcuts or focus behavior if not careful, but keeping it if it was there for a reason (likely to prevent scrolling on Space).
      if (e.key === " ") e.preventDefault();
    },
    [state],
  );

  return (
    <article className="mx-auto max-w-7xl px-12 pt-6 font-serif">
      <Header wpm={state.wpm} accuracy={state.accuracy} />
      <NewsHeader news={news} />
      <NewsContent state={state} handleOnKeyDown={handleOnKeyDown} />
    </article>
  );
}
