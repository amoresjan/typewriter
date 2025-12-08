export type TypingAction =
  | { type: "TYPE_LETTER"; letter: string }
  | { type: "DELETE_LETTER" }
  | { type: "SUBMIT_WORD" }
  | { type: "UPDATE_WPM" }
  | { type: "DISMISS_AFK_TOAST" };
