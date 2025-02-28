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
      e.preventDefault();
    },
    [state],
  );

  return (
    <article className="mx-auto max-w-7xl px-12 pt-6 font-serif">
      <Header />
      <NewsHeader news={news} />
      <NewsContent state={state} handleOnKeyDown={handleOnKeyDown} />
    </article>
  );
}
