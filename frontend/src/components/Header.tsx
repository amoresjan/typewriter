import React, { useState } from "react";

import { useGameState } from "@context/GameContext";
import { useAuth } from "@context/AuthContext";
import { AuthModal } from "@components/auth/AuthModal";

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

const HeaderMeta: React.FC<{ date: string }> = React.memo(({ date }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-ink font-sans text-sm">
        <button
          className="w-48 text-left hover:underline"
          onClick={() => setModalOpen(true)}
        >
          {user?.username ?? "Guest"}
        </button>
        <p className="uppercase">{formattedDate}</p>
        <Stats />
      </div>
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
});

const Header: React.FC<{ date: string }> = React.memo(({ date }) => {
  return (
    <header className="mb-6">
      <HeaderTitle />
      <HeaderMeta date={date} />
    </header>
  );
});

export default Header;
