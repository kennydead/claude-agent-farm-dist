import { useEffect } from "react";

interface Props {
  onBack: () => void;
}

export default function RunningScreen({ onBack: _onBack }: Props) {
  useEffect(() => {
    // Navigate the window to the dashboard
    window.location.href = "http://localhost:5174";
  }, []);

  return null;
}
