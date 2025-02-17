import React from "react";

type HeaderProps = {
  wpm: string;
};

const Header: React.FC<HeaderProps> = ({ wpm }) => {
  return (
    <header className="mb-6">
      <h1 className="border-b-[1px] border-black pb-4 text-center text-6xl font-bold">
        Typewriter Times
      </h1>
      <div className="mt-1 flex flex-row justify-between border-b-2 border-black">
        <div>amoresjan</div>
        <p>SUNDAY, JANUARY 19, 2025</p>
        <p className="w-[120px] text-right">{wpm} WPM | 97%</p>
      </div>
    </header>
  );
};

export default Header;
