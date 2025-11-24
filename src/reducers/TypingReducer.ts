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
    case "TYPE_LETTER": {
      const now = Date.now();
      const timeSinceLastKeystroke =
        state.lastKeystrokeTime !== null ? now - state.lastKeystrokeTime : 0;

      // If pause is less than 5 seconds, add to active time.
      // If it's the first keystroke (lastKeystrokeTime is null), we don't add anything yet,
      // or we can consider it 0. Let's start counting active time from the first keystroke gap?
      // Actually, for the very first letter, activeTime is 0.
      // For subsequent letters, we add the delta if it's < 5000ms.
      const newActiveTime =
        state.lastKeystrokeTime !== null && timeSinceLastKeystroke < 5000
          ? state.activeTime + timeSinceLastKeystroke
          : state.activeTime;

      const typedWord = state.typedWord + action.letter;
      const wpm = calculateWpm(state, typedWord, newActiveTime);

      // Accuracy Logic
      const totalCharsTyped = state.totalCharsTyped + 1;
      const currentWord = state.wordsList[state.currentWordIndex];
      const letterIndex = typedWord.length - 1;
      const isIncorrect = currentWord[letterIndex] !== action.letter;
      const totalErrors = isIncorrect ? state.totalErrors + 1 : state.totalErrors;
      const accuracy = Math.round(((totalCharsTyped - totalErrors) / totalCharsTyped) * 100);

      return {
        ...state,
        typedWord,
        activeTime: newActiveTime,
        lastKeystrokeTime: now,
        wpm,
        totalCharsTyped,
        totalErrors,
        accuracy,
      };
    }

    case "DELETE_LETTER":
      return { ...state, typedWord: state.typedWord.slice(0, -1) };

    case "SUBMIT_WORD": {
      if (state.typedWord === state.wordsList[state.currentWordIndex]) {
        const now = Date.now();
        const timeSinceLastKeystroke =
          state.lastKeystrokeTime !== null ? now - state.lastKeystrokeTime : 0;

        const newActiveTime =
          state.lastKeystrokeTime !== null && timeSinceLastKeystroke < 5000
            ? state.activeTime + timeSinceLastKeystroke
            : state.activeTime;

        const currentWordIndex = state.currentWordIndex + 1;
        const wpm = calculateWpm(
          { ...state, currentWordIndex },
          "",
          newActiveTime,
        );
        return {
          ...state,
          currentWordIndex,
          typedWord: "",
          activeTime: newActiveTime,
          lastKeystrokeTime: now,
          wpm,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

function calculateWpm(
  state: TypingState,
  currentTypedWord: string,
  activeTimeMs: number,
): number {
  const timeElapsedMinutes = activeTimeMs / 1000 / 60;
  if (timeElapsedMinutes === 0) return 0;

  const completedWordsLength = state.wordsList
    .slice(0, state.currentWordIndex)
    .reduce((acc, word) => acc + word.length, 0);

  // Add spaces for completed words
  const spacesCount = state.currentWordIndex;

  const currentTargetWord = state.wordsList[state.currentWordIndex];
  let correctCharsInCurrentWord = 0;
  const lengthToCompare = Math.min(
    currentTypedWord.length,
    currentTargetWord.length,
  );

  for (let i = 0; i < lengthToCompare; i++) {
    if (currentTypedWord[i] === currentTargetWord[i]) {
      correctCharsInCurrentWord++;
    }
  }

  const totalChars =
    completedWordsLength + spacesCount + correctCharsInCurrentWord;
  const wpm = Math.round(totalChars / 5 / timeElapsedMinutes);

  return wpm;
}
