 import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { TypingState } from "../types";
import { TypingAction, typingReducer } from "../reducers/TypingReducer";
import { NEWS_CONTENT_MOCK } from "../mocks/NewsContentMock";

const GameStateContext = createContext<TypingState | null>(null);
const GameDispatchContext = createContext<Dispatch<TypingAction> | null>(null);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (!context) {
    throw new Error("useGameDispatch must be used within a GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  return (
    <GameDispatchContext.Provider value={dispatch}>
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameDispatchContext.Provider>
  );
};
