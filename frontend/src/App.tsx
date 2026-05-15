import { useState } from "react";
import TypewriterGame from "@components/TypewriterGame";
import Footer from "@components/Footer";

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TypewriterGame
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <Footer />
    </div>
  );
}
