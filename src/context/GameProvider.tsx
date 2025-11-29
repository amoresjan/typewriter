import React, { useReducer } from "react";
import { typingReducer } from "@reducers/TypingReducer";
import { News } from "@app-types";
import { GameDispatchContext, GameStateContext } from "./GameContext";

export const GameProvider: React.FC<{
  children: React.ReactNode;
  news: News;
}> = ({ children, news }) => {
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

  return (
    <GameDispatchContext.Provider value={dispatch}>
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameDispatchContext.Provider>
  );
};
