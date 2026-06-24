import { useState } from "react";
import LicenseScreen from "./LicenseScreen";
import DockerScreen from "./DockerScreen";
import ProviderScreen from "./ProviderScreen";
import AuthScreen from "./AuthScreen";
import StartupScreen from "./StartupScreen";

export type SetupStep = "license" | "docker" | "provider" | "auth" | "startup";

interface Props {
  onComplete: () => void;
}

export default function SetupFlow({ onComplete }: Props) {
  const [step, setStep] = useState<SetupStep>("license");
  const [licenseKey, setLicenseKey] = useState("");

  switch (step) {
    case "license":
      return (
        <LicenseScreen
          onVerified={(key) => { setLicenseKey(key); setStep("docker"); }}
        />
      );
    case "docker":
      return <DockerScreen onReady={() => setStep("provider")} />;
    case "provider":
      return <ProviderScreen onSelected={() => setStep("auth")} />;
    case "auth":
      return <AuthScreen onAuthenticated={() => setStep("startup")} />;
    case "startup":
      return <StartupScreen licenseKey={licenseKey} onReady={onComplete} />;
  }
}
