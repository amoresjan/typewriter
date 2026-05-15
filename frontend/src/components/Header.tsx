import React, { useState } from "react";
import { useGameState } from "@context/GameContext";
import { useAuth } from "@context/AuthContext";
import { AuthModal } from "@components/auth/AuthModal";
import { DatePicker } from "@components/DatePicker";

const HeaderTitle: React.FC = React.memo(() => (
  <h1 className="border-b border-ink pb-4 text-center font-old-english text-5xl">
    The Typewriter Times
  </h1>
));

const Stats: React.FC = React.memo(() => {
  const state = useGameState();
  const { wpm, accuracy } = state;
  return (
    <p className="w-48 text-right tabular-nums">
      {wpm} WPM · {accuracy}%
    </p>
  );
});

const HeaderMeta: React.FC<{
  date: string;
  onDateSelect: (date: string | undefined) => void;
}> = React.memo(({ date, onDateSelect }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-ink font-sans text-sm">
        <button
          className="w-48 cursor-pointer text-left hover:underline"
          onClick={() => setModalOpen(true)}
        >
          {user?.username ?? "Guest"}
        </button>
        <DatePicker newsDate={date} onSelect={onDateSelect} />
        <Stats />
      </div>
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
});

const Header: React.FC<{
  date: string;
  onDateSelect: (date: string | undefined) => void;
}> = React.memo(({ date, onDateSelect }) => {
  return (
    <header className="mb-6">
      <HeaderTitle />
      <HeaderMeta date={date} onDateSelect={onDateSelect} />
    </header>
  );
});

export default Header;
