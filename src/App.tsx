"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const originalContent = `Ukraine has made good on its promise to halt the transport of Russian gas to Europe through its territory after a key deal with Moscow expired on Wednesday.

Ukraine’s refusal to renew the transit deal was an expected but symbolic move after nearly three years of its full-scale war with Russia, and comes after Europe has already drastically cut Moscow’s share of its gas imports. Ukraine’s energy ministry said it ended the deal “in the interests of national security.”

“We have stopped the transit of Russian gas. This is a historic event,” the ministry said in a statement, adding that its gas transportation infrastructure had been prepared in advance of the expiration. Last year, Kremlin-owned gas giant Gazprom, which signed the transit deal with Ukraine’s Naftogaz in 2019, recorded a $6.9 billion loss, its first in more than 20 years, due to diminished sales to Europe, Reuters reported. That’s despite its efforts to boost exports to new buyer China.

Ukraine now faces the loss of some $800 million a year in transit fees from Russia, while Gazprom will lose close to $5 billion in gas sales, according to the news agency. Several European countries still purchasing Russian gas had previously arranged alternative supply routes, it reported.

The lapsed deal had represented about 5% of the European Union’s total gas imports, according to Brussels-based think tank Bruegel, and supplied mainly Austria, Hungary and Slovakia. Now, after its expiry, Europe receives pipeline gas from Russia via a single route: The Turkstream pipeline, which runs through Turkey and on to Bulgaria, Serbia and Hungary, says Bruegel.

Henning Gloystein, head of Energy, Climate & Resources at Eurasia Group, said the deal’s end came as “no surprise” but expects it to trigger a jump in spot gas prices when markets reopen on Thursday.

But “a major price spike as seen during the previous Russian supply cuts is unlikely as EU importers have long prepared for this (scenario),” he told CNN, adding that most of Europe has had a mild start to winter.

The European Union has been working with countries for over a year to prepare for the possibility of the deal’s expiry, a spokeswoman for the European Commission told CNN.

“The European gas infrastructure is flexible enough to provide gas of non-Russian origin to (central and eastern Europe) via alternative routes,” the spokeswoman said. “It has been reinforced with significant new (liquefied natural gas) import capacities since 2022.”

“We did our homework and were well prepared for this scenario,” Austria’s Energy Minister Leonore Gewessler said in a statement on X early Wednesday, adding that the country’s energy firms had sought out new, non-Russian suppliers.

However, Slovakia’s Prime Minister Robert Fico said on Wednesday that the halt of Russian gas flows via Ukraine will have a “drastic” impact on the EU but not on Russia, according to a Reuters report.

Fico has previously argued that the end of the deal would lead to higher gas and electricity prices in Europe, the news agency said.`;

const originalWords = originalContent.split(/\s+/);

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === " " || e.key === "Enter") {
        const isCorrect = originalWords[currentWordIndex] === typedWord;
        if (isCorrect) {
          setCurrentWordIndex((prev) => prev + 1);
          setTypedWord("");
        }
      } else if (e.key === "Backspace") {
        setTypedWord((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setTypedWord((prev) => prev + e.key);
      }
      e.preventDefault();
    },
    [currentWordIndex, typedWord],
  );

  /**
   * Renders the typing test content with appropriate styling based on typing progress.
   * - Words before the current word are black (fully typed correctly).
   * - The current word is styled dynamically to indicate correct, incorrect, or pending letters.
   * - Future words are gray (not yet typed).
   */
  const renderedContent = () => {
    return originalWords.map((word, wordIndex) => {
      // Fully typed words are displayed in black
      if (wordIndex < currentWordIndex) {
        return (
          <span key={wordIndex} className="text-black">
            {word}{" "}
          </span>
        );
      }

      // Current word being typed
      if (wordIndex === currentWordIndex) {
        return (
          <span key={wordIndex}>
            {word.split("").map((letter, letterIndex) => {
              const isCurrentLetter = letterIndex === typedWord.length;
              const isIncorrect =
                typedWord[letterIndex] && typedWord[letterIndex] !== letter;
              const isNotTypedYet = letterIndex >= typedWord.length;

              return (
                <span
                  key={letterIndex}
                  className={
                    `${isCurrentLetter ? "bg-black text-white" : ""} ` +
                    `${isIncorrect ? "bg-red-400 text-white decoration-red-800" : ""} ` +
                    `${isNotTypedYet ? "text-gray-300" : "text-black"}`
                  }
                >
                  {letter}
                </span>
              );
            })}
            {/* Handles overtyped characters (extra incorrect input) */}
            {typedWord.length > word.length &&
              typedWord
                .slice(word.length)
                .split("")
                .map((extraChar, extraIndex) => (
                  <span
                    key={`extra-${extraIndex}`}
                    className="bg-red-400 text-white decoration-red-800"
                  >
                    {extraChar}
                  </span>
                ))}{" "}
          </span>
        );
      }

      // Future words that have not been typed yet
      return (
        <span key={wordIndex} className="text-gray-300">
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <article className="mx-auto max-w-7xl px-12 pt-6 font-serif">
      <header className="mb-6">
        <h1 className="border-b-[1px] border-black pb-4 text-center text-6xl font-bold">
          Typewriter Times
        </h1>
        <div className="mt-1 flex flex-row justify-between border-b-2 border-black">
          <div>amoresjan</div>
          <p>SUNDAY, JANUARY 19, 2025</p>
          <p>120 WPM | 97%</p>
        </div>
      </header>
      <body>
        <div className="mb-4">
          <h2 className="mb-1 text-4xl font-semibold">
            Ukraine ends supply of Russian gas to Europe
          </h2>
          <h3 className="text-[#6e6e6e]">
            Kosta Gak, Alex Stambaugh, Anna Cooban - CNN
          </h3>
        </div>
        <h3>Words index: {currentWordIndex}</h3>
        <h3>Typed word: {typedWord}</h3>
        <div
          className="mt-4 grid outline-none"
          ref={contentRef}
          tabIndex={0}
          onKeyDown={handleOnKeyDown}
        >
          <p className="columns-2 gap-4 text-justify leading-tight">
            {renderedContent()}
          </p>
        </div>
      </body>
    </article>
  );
}
