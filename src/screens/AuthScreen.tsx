import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import Layout from "../components/Layout";
import Button from "../components/Button";
import "./Screen.css";

interface Props {
  onAuthenticated: () => void;
}

type AuthState = "checking" | "needed" | "waiting-code" | "authenticated" | "error";

const IMAGE = "ghcr.io/kennydead/claude-agent-farm/agent:latest";

async function checkAuth(): Promise<boolean> {
  try {
    const out = await invoke<string>("run_command", {
      program: "docker",
      args: [
        "run", "--rm", "--platform", "linux/amd64",
        "--entrypoint", "",
        "-v", "claudeagentfarm_claude-home:/home/agent",
        IMAGE, "claude", "auth", "status", "--json",
      ],
    });
    return out.includes('"loggedIn": true');
  } catch {
    return false;
  }
}

export default function AuthScreen({ onAuthenticated }: Props) {
  const [state, setState] = useState<AuthState>("checking");
  const [loginUrl, setLoginUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) onAuthenticated();
      else setState("needed");
    });
  }, []);

  async function startLogin() {
    setState("waiting-code");
    setError("");
    // Run claude auth login and capture the URL from its output
    try {
      const out = await invoke<string>("run_command", {
        program: "docker",
        args: [
          "run", "--rm", "--platform", "linux/amd64",
          "--entrypoint", "",
          "-v", "claudeagentfarm_claude-home:/home/agent",
          IMAGE, "claude", "auth", "login", "--print-url",
        ],
      });
      const match = out.match(/https:\/\/[^\s]+/);
      if (match) setLoginUrl(match[0]);
    } catch (e) {
      setState("error");
      setError(String(e));
    }
  }

  async function submitCode() {
    if (!code.trim()) return;
    try {
      await invoke<string>("run_command", {
        program: "docker",
        args: [
          "run", "--rm", "--platform", "linux/amd64",
          "--entrypoint", "",
          "-v", "claudeagentfarm_claude-home:/home/agent",
          IMAGE, "sh", "-c", `echo '${code.trim()}' | claude auth login`,
        ],
      });
      const ok = await checkAuth();
      if (ok) onAuthenticated();
      else { setState("error"); setError("Authentication failed. Please try again."); }
    } catch (e) {
      setState("error");
      setError(String(e));
    }
  }

  return (
    <Layout>
      <div className="screen">
        <div className="screen-header">
          <h1>Sign in to Claude</h1>
          <p className="screen-subtitle">
            Your agents need a Claude account to operate.
          </p>
        </div>

        <div className="screen-body">
          {state === "checking" && (
            <div className="status-row">
              <span className="status-spinner" />
              <span className="status-text">Checking authentication…</span>
            </div>
          )}

          {state === "needed" && (
            <div className="auth-card">
              <p>You'll be redirected to Claude's sign-in page. Come back here after logging in.</p>
            </div>
          )}

          {state === "waiting-code" && (
            <div className="auth-flow">
              {loginUrl ? (
                <>
                  <div className="auth-url-box">
                    <p className="auth-url-label">Open this URL in your browser:</p>
                    <button className="auth-url" onClick={() => openUrl(loginUrl)}>
                      {loginUrl}
                    </button>
                    <Button variant="ghost" onClick={() => openUrl(loginUrl)}>
                      Open in Browser
                    </Button>
                  </div>
                  <div className="field">
                    <label className="field-label">Paste the code from your browser</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Paste code here…"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitCode()}
                      autoFocus
                    />
                  </div>
                </>
              ) : (
                <div className="status-row">
                  <span className="status-spinner" />
                  <span className="status-text">Preparing login…</span>
                </div>
              )}
            </div>
          )}

          {state === "error" && (
            <p className="field-error">{error}</p>
          )}

          {state === "authenticated" && (
            <div className="status-row">
              <span className="status-check">✓</span>
              <span className="status-text">Authenticated successfully</span>
            </div>
          )}
        </div>

        {state === "needed" && (
          <Button onClick={startLogin} fullWidth>Get Login URL</Button>
        )}
        {state === "waiting-code" && loginUrl && (
          <Button onClick={submitCode} disabled={!code.trim()} fullWidth>
            Confirm Sign In
          </Button>
        )}
        {state === "error" && (
          <Button onClick={() => setState("needed")} fullWidth>Try Again</Button>
        )}
      </div>
    </Layout>
  );
}
