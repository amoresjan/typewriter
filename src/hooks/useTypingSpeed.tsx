import { useEffect, useState } from "react";
import { TypingState } from "../types";

const useTypingSpeed = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const endTimer = () => {
    setIsRunning(false);
  };

  const calculateWpm = (state: TypingState) => {
    const foo = state.wordsList.slice(0, state.currentWordIndex);
    const totalCharacters =
      foo.reduce((total, str) => total + str.length, 0) +
      state.typedWord.length;

    const final = time > 0 ? Math.round(totalCharacters / 5 / (time / 60)) : 0;
    console.log(`${totalCharacters} / 5 / ${time} = ${final}`);

    return final.toString();
  };

  return { startTimer, endTimer, calculateWpm };
};

export default useTypingSpeed;
