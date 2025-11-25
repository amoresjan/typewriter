import React from "react";

interface HeaderProps {
  wpm: number;
  accuracy: number;
}

const Header: React.FC<HeaderProps> = ({ wpm, accuracy }) => {
  return (
    <header className="mb-6">
      <h1 className="border-b-[1px] border-black pb-4 text-center font-old-english text-6xl">
        The Typewriter Times
      </h1>
      <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-black font-helvetica">
        <div className="w-48">amoresjan</div>
        <p>SUNDAY, JANUARY 19, 2025</p>
        <p className="w-48 text-right tabular-nums">
          {wpm} WPM | {accuracy}%
        </p>
      </div>
    </header>
  );
};

export default Header;
