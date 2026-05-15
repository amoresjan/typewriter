import React, { useState } from "react";
import { Share1Icon, ReloadIcon } from "@radix-ui/react-icons";
import Modal from "@components/common/Modal";
import NeoButton from "@components/common/NeoButton";

interface GameCompletionProps {
  wpm: number;
  accuracy: number;
  totalErrors: number;
  newsTitle: string;
  onRestart?: () => void;
}

const GameCompletion: React.FC<GameCompletionProps> = ({
  wpm,
  accuracy,
  totalErrors,
  newsTitle,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `I typed "${newsTitle}" on The Typewriter Times. ${wpm} WPM, ${accuracy}% accuracy.\n\nhttps://typewriter.amoresjan.dev`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Modal
      className="animate-modal-enter w-full max-w-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <h2 id="completion-title" className="mb-6 font-old-english text-2xl">
        Edition Complete
      </h2>

      <div className="mb-4">
        <div
          className="font-sans text-[5rem] leading-none font-bold tabular-nums"
          aria-label={`${wpm} words per minute`}
        >
          {wpm}
        </div>
        <div className="mt-2 font-sans text-xs font-medium tracking-widest text-attribution uppercase">
          WPM
        </div>
      </div>

      <div className="mb-4 border-t border-ash-border" />

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div aria-label={`${accuracy}% accuracy`}>
          <div className="font-sans text-[2.5rem] leading-none font-bold tabular-nums">
            {accuracy}%
          </div>
          <div className="mt-2 font-sans text-xs font-medium tracking-widest text-attribution uppercase">
            Accuracy
          </div>
        </div>
        <div aria-label={`${totalErrors} error${totalErrors !== 1 ? "s" : ""}`}>
          <div className="font-sans text-[2.5rem] leading-none font-bold tabular-nums">
            {totalErrors}
          </div>
          <div className="mt-2 font-sans text-xs font-medium tracking-widest text-attribution uppercase">
            Errors
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <NeoButton autoFocus onClick={handleShare} icon={<Share1Icon />}>
          {copied ? "Copied to clipboard" : "Share Result"}
        </NeoButton>
        {onRestart && (
          <NeoButton
            onClick={onRestart}
            variant="secondary"
            icon={<ReloadIcon />}
          >
            Play Again
          </NeoButton>
        )}
      </div>
    </Modal>
  );
};

export default GameCompletion;
