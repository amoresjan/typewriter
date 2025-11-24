export type TypingState = {
  currentWordIndex: number;
  typedWord: string;
  wordsList: string[];
  activeTime: number;
  lastKeystrokeTime: number | null;
  wpm: number;
  totalCharsTyped: number;
  totalErrors: number;
  accuracy: number;
};
