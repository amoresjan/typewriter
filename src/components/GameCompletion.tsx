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

import StatItem from "@components/common/StatItem";

const GameCompletion: React.FC<GameCompletionProps> = ({
  wpm,
  accuracy,
  totalErrors,
  newsTitle,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `😱 ${newsTitle} 😱\n\nI typed this news at ${wpm} WPM with ${accuracy}% accuracy on Typewriter!\n\nhttps://typewriter.amoresjan.dev`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Modal className="w-full max-w-md">
      <h2 className="mb-6 font-old-english text-4xl">Congratulations!</h2>

      <div className="mb-8 grid grid-cols-3 gap-4 font-sans">
        {[
          { label: "WPM", value: wpm },
          { label: "Accuracy", value: `${accuracy}%` },
          { label: "Errors", value: totalErrors },
        ].map((stat) => (
          <StatItem key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <NeoButton
          onClick={handleShare}
          icon={<Share1Icon />}
          className="font-sans"
        >
          {copied ? "Copied!" : "Share Result"}
        </NeoButton>

        {onRestart && (
          <NeoButton
            onClick={onRestart}
            variant="secondary"
            icon={<ReloadIcon />}
            className="font-sans"
          >
            Play Again
          </NeoButton>
        )}
      </div>
    </Modal>
  );
};

export default GameCompletion;
