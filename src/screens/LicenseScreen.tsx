import { useState } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import "./Screen.css";

interface Props {
  onVerified: (key: string) => void;
}

const LICENSE_SERVER = "https://license.claudeagentfarm.com";

export default function LicenseScreen({ onVerified }: Props) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    if (!key.trim()) return;
    setLoading(true);
    setError("");
    // In dev mode, any non-empty key passes
    if (import.meta.env.DEV) {
      setTimeout(() => onVerified(key.trim()), 500);
      return;
    }
    try {
      const res = await fetch(`${LICENSE_SERVER}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      if (res.ok) {
        onVerified(key.trim());
      } else {
        setError("Invalid license key. Please check and try again.");
      }
    } catch {
      setError("Could not reach the license server. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="screen">
        <div className="screen-header">
          <h1>Welcome to Flux</h1>
          <p className="screen-subtitle">Enter your license key to get started.</p>
        </div>

        <div className="screen-body">
          <div className="field">
            <label className="field-label">License Key</label>
            <input
              className="field-input"
              type="text"
              placeholder="FLUX-XXXX-XXXX-XXXX"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              autoFocus
              spellCheck={false}
            />
            {error && <p className="field-error">{error}</p>}
          </div>
        </div>

        <Button onClick={verify} loading={loading} disabled={!key.trim()} fullWidth>
          Verify License
        </Button>

        <p className="screen-footnote">
          Don't have a key? Contact us at <span className="link">support@claudeagentfarm.com</span>
        </p>
      </div>
    </Layout>
  );
}
