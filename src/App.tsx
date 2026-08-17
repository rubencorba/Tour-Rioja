import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { TourPage } from "./pages/TourPage";

type Screen = "landing" | "tour";

function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  return (
    <div className="h-screen w-screen">
      {screen === "landing" ? (
        <LandingPage onEnter={() => setScreen("tour")} />
      ) : (
        <TourPage />
      )}
    </div>
  );
}

export default App;
