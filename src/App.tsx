import { useState } from "react";
import SetupFlow from "./screens/SetupFlow";
import RunningScreen from "./screens/RunningScreen";

export type AppScreen = "setup" | "running";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("setup");

  if (screen === "running") {
    return <RunningScreen onBack={() => setScreen("setup")} />;
  }

  return <SetupFlow onComplete={() => setScreen("running")} />;
}
