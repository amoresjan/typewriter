import { TypingState, TypingAction } from "@app-types";

const AFK_THRESHOLD_MS = 5000; // 5 seconds

export function typingReducer(
  state: TypingState,
  action: TypingAction,
): TypingState {
  switch (action.type) {
    case "TYPE_LETTER": {
      const currentWord = state.wordsList[state.currentWordIndex];
      const maxLength = currentWord.length + 5;

      // Prevent typing beyond current word + 5 characters
      if (state.typedWord.length >= maxLength) {
        return state;
      }

      const now = Date.now();
      const timeSinceLastKeystroke =
        state.lastKeystrokeTime !== null ? now - state.lastKeystrokeTime : 0;

      // If pause is less than 5 seconds, add to active time.
      const newActiveTime =
        state.lastKeystrokeTime !== null && timeSinceLastKeystroke < AFK_THRESHOLD_MS
          ? state.activeTime + timeSinceLastKeystroke
          : state.activeTime;

      const typedWord = state.typedWord + action.letter;

      // Accuracy Logic
      const totalCharsTyped = state.totalCharsTyped + 1;
      const letterIndex = typedWord.length - 1;
      const isIncorrect = currentWord[letterIndex] !== action.letter;
      const totalErrors = isIncorrect
        ? state.totalErrors + 1
        : state.totalErrors;
      const accuracy = Math.round(
        ((totalCharsTyped - totalErrors) / totalCharsTyped) * 100,
      );

      const isLastWord = state.currentWordIndex === state.wordsList.length - 1;
      const isWordFinished = isLastWord && typedWord === currentWord;

      return {
        ...state,
        typedWord: isWordFinished ? "" : typedWord,
        currentWordIndex: isWordFinished
          ? state.currentWordIndex + 1
          : state.currentWordIndex,
        activeTime: newActiveTime,
        lastKeystrokeTime: now,
        isAfk: false, // User is typing, not AFK
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
          state.lastKeystrokeTime !== null && timeSinceLastKeystroke < AFK_THRESHOLD_MS
            ? state.activeTime + timeSinceLastKeystroke
            : state.activeTime;

        const currentWordIndex = state.currentWordIndex + 1;
        return {
          ...state,
          currentWordIndex,
          typedWord: "",
          activeTime: newActiveTime,
          lastKeystrokeTime: now,
          isAfk: false, // User is typing, not AFK
        };
      }
      return state;
    }

    case "UPDATE_WPM": {
      const now = Date.now();
      const timeSinceLastKeystroke =
        state.lastKeystrokeTime !== null ? now - state.lastKeystrokeTime : 0;

      // Check if user is AFK (no typing for 5+ seconds)
      const isNowAfk =
        state.lastKeystrokeTime !== null &&
        timeSinceLastKeystroke >= AFK_THRESHOLD_MS;

      // If just became AFK, readjust WPM to 5 seconds ago (oldest value in history)
      if (isNowAfk && !state.isAfk) {
        // Get the oldest WPM in history (from ~5 seconds ago when actively typing)
        const previousWpm =
          state.wpmHistory.length > 0
            ? state.wpmHistory[state.wpmHistory.length - 1]
            : 0;
        return {
          ...state,
          wpm: previousWpm,
          wpmHistory: [previousWpm], // Reset history to the readjusted WPM
          isAfk: true,
          showAfkToast: true,
        };
      }

      // If AFK, don't update WPM
      if (isNowAfk) {
        return state;
      }

      // Calculate current WPM including idle time (so it decreases when not typing)
      const currentWpm = calculateWpm(state, timeSinceLastKeystroke);

      // Update WPM history (keep last 5 values)
      const newWpmHistory = [currentWpm, ...state.wpmHistory].slice(0, 5);

      return {
        ...state,
        wpm: currentWpm,
        wpmHistory: newWpmHistory,
      };
    }

    case "DISMISS_AFK_TOAST":
      return { ...state, showAfkToast: false };

    default:
      return state;
  }
}

function calculateWpm(state: TypingState, idleTimeMs: number = 0): number {
  // Include idle time in the calculation so WPM drops when not typing
  const totalTimeMs = state.activeTime + idleTimeMs;
  const timeElapsedMinutes = totalTimeMs / 1000 / 60;
  if (timeElapsedMinutes === 0) return 0;

  const completedWordsLength = state.wordsList
    .slice(0, state.currentWordIndex)
    .reduce((acc: number, word: string) => acc + word.length, 0);

  // Add spaces for completed words
  const spacesCount = state.currentWordIndex;

  // If game is finished (currentWordIndex >= wordsList.length), currentTargetWord will be undefined.
  const currentTargetWord = state.wordsList[state.currentWordIndex] || "";

  let correctCharsInCurrentWord = 0;
  const lengthToCompare = Math.min(
    state.typedWord.length,
    currentTargetWord.length,
  );

  for (let i = 0; i < lengthToCompare; i++) {
    if (state.typedWord[i] === currentTargetWord[i]) {
      correctCharsInCurrentWord++;
    }
  }

  const totalChars =
    completedWordsLength + spacesCount + correctCharsInCurrentWord;
  const wpm = Math.round(totalChars / 5 / timeElapsedMinutes);

  return wpm;
}

