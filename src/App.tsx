"use client";

import { useRef } from "react";

const originalContent = ` Ukraine has made good on its promise to halt the transport of Russian gas to Europe through its territory after a key deal with Moscow expired on Wednesday.

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

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <article className="max-w-4x1 mx-auto font-serif p-7">
      <header className="font-headline border-b-4 border-black pb-4 mb-8">
        <h1 className="text-center text-6xl font-bold mb-2">
          Typewriter Times
        </h1>
        <p className="text-l text-center italic">
          A nostalgic typing journey inspired by classic journalism.
        </p>
      </header>
      <h2 className="text-4xl font-bold mb-4 font-headline">
        Ukraine ends supply of Russian gas to Europe
      </h2>
      <div className="grid outline-none" ref={contentRef} tabIndex={0}>
        <p className="columns-2 gap-4 text-justify leading-tight">
          {originalContent}
        </p>
      </div>
    </article>
  );
}
