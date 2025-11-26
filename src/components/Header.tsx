import React from "react";

import { useGameState } from "../context/GameContext";

const HeaderTitle: React.FC = React.memo(() => (
  <h1 className="border-b-[1px] border-black pb-4 text-center font-old-english text-7xl">
    The Typewriter Times
  </h1>
));

const Stats: React.FC = React.memo(() => {
  const state = useGameState();
  const { wpm, accuracy } = state;

  return (
    <p className="w-48 text-right tabular-nums">
      {wpm} WPM | {accuracy}%
    </p>
  );
});

import { User } from "../types";

const USER: User = {
  id: "1",
  username: "amoresjan",
};

const HeaderMeta: React.FC = React.memo(() => (
  <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-black font-helvetica">
    <div className="w-48">{USER.username}</div>
    <p>SUNDAY, JANUARY 19, 2025</p>
    <Stats />
  </div>
));

const Header: React.FC = React.memo(() => {
  return (
    <header className="mb-6">
      <HeaderTitle />
      <HeaderMeta />
    </header>
  );
});

export default Header;
