import React from "react";

import { useGameState } from "@context/GameContext";

const HeaderTitle: React.FC = React.memo(() => (
  <h1 className="border-b-[1px] border-black pb-4 text-center font-old-english text-5xl">
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

import { User } from "@app-types";

const USER: User = {
  id: "1",
  username: "amoresjan",
};

const HeaderMeta: React.FC<{ date: string }> = React.memo(({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-black font-sans">
      <div className="w-48">{USER.username}</div>
      <p className="uppercase">{formattedDate}</p>
      <Stats />
    </div>
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
