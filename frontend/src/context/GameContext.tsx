import { createContext, Dispatch, useContext } from "react";
import { TypingState, TypingAction } from "@app-types";

export const GameStateContext = createContext<TypingState | null>(null);
export const GameDispatchContext = createContext<Dispatch<TypingAction> | null>(
  null,
);

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
