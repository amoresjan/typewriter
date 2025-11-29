"use client";

import TypewriterGame from "@components/TypewriterGame";
import Footer from "@components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TypewriterGame />
      <Footer />
    </div>
  );
}
