export type TypingAction =
  | { type: "TYPE_LETTER"; letter: string }
  | { type: "DELETE_LETTER" }
  | { type: "SUBMIT_WORD" };
