import React, { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Printing papers",
  "Interviewing witnesses",
  "Fact-checking claims",
  "Brewing coffee",
  "Fixing typos",
  "Drafting headlines",
  "Developing photos",
  "Chasing leads",
  "Meeting deadlines",
  "Sharpening pencils",
  "Replacing ink ribbons",
  "Spilling ink",
  "Calling the editor",
  "Proofreading drafts",
  "Loading the press",
];

const Loading: React.FC = () => {
  const [dots, setDots] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(
      LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="text-5xl font-old-english">The Typewriter Times</div>
      <div className="font-helvetica py-4">
        {message}
        {dots}
      </div>
    </div>
  );
};

export default Loading;
