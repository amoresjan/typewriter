export type TypingState = {
  currentWordIndex: number;
  typedWord: string;
  wordsList: string[];
  activeTime: number;
  lastKeystrokeTime: number | null;
  wpm: number;
  wpmHistory: number[]; // Last 5 WPM values for AFK readjustment
  isAfk: boolean;
  showAfkToast: boolean;
  totalCharsTyped: number;
  totalErrors: number;
  accuracy: number;
};
