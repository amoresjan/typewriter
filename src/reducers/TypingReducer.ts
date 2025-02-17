import { TypingState } from "../types";

export type TypingAction =
  | { type: "TYPE_LETTER"; letter: string }
  | { type: "DELETE_LETTER" }
  | { type: "SUBMIT_WORD" };

export function typingReducer(
  state: TypingState,
  action: TypingAction,
): TypingState {
  switch (action.type) {
    case "TYPE_LETTER":
      return { ...state, typedWord: state.typedWord + action.letter };

    case "DELETE_LETTER":
      return { ...state, typedWord: state.typedWord.slice(0, -1) };

    case "SUBMIT_WORD":
      return state.typedWord === state.wordsList[state.currentWordIndex]
        ? {
            ...state,
            currentWordIndex: state.currentWordIndex + 1,
            typedWord: "",
          }
        : state; // If incorrect, do nothing

    default:
      return state;
  }
}
