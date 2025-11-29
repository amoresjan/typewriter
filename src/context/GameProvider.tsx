import React, { useEffect, useReducer, useRef } from "react";
import { typingReducer } from "@reducers/TypingReducer";
import { News, TypingState } from "@app-types";
import { GameDispatchContext, GameStateContext } from "./GameContext";

export const GameProvider: React.FC<{
  children: React.ReactNode;
  news: News;
}> = ({ children, news }) => {
  const wordsList = news.content.split(/\s+/);
  const STORAGE_KEY = "typewriter_game_state";

  const loadSavedState = (): TypingState | undefined => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.newsId === news.id) {
          return parsed.state;
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
    return undefined;
  };

  const initialState: TypingState = loadSavedState() || {
    currentWordIndex: 0,
    typedWord: "",
    wordsList: wordsList,
    activeTime: 0,
    lastKeystrokeTime: null,
    wpm: 0,
    totalCharsTyped: 0,
    totalErrors: 0,
    accuracy: 100,
  };

  const [state, dispatch] = useReducer(typingReducer, initialState);

  // Keep a ref to the state for the event listener
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Clear storage when game is finished
 useEffect(() => {
    if (state.currentWordIndex >= state.wordsList.length) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.currentWordIndex, state.wordsList.length]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentState = stateRef.current;
      const isGameFinished =
        currentState.currentWordIndex >= currentState.wordsList.length;

      const hasStarted =
        currentState.currentWordIndex > 0 || currentState.typedWord.length > 0;

      if (!isGameFinished && hasStarted) {
        e.preventDefault();
        // Save state
        const stateToSave = {
          newsId: news.id,
          state: currentState,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [news.id]);

  return (
    <GameDispatchContext.Provider value={dispatch}>
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameDispatchContext.Provider>
  );
};
