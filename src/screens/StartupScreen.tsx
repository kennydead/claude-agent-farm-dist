import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Layout from "../components/Layout";
import "./Screen.css";

interface Props {
  licenseKey: string;
  onReady: () => void;
}

interface Step {
  id: string;
  label: string;
  state: "pending" | "active" | "done" | "error";
}

const INITIAL_STEPS: Step[] = [
  { id: "docker",   label: "Docker found",             state: "pending" },
  { id: "license",  label: "License verified",         state: "pending" },
  { id: "pull",     label: "Pulling latest images",    state: "pending" },
  { id: "start",    label: "Starting services",        state: "pending" },
  { id: "ready",    label: "Ready",                    state: "pending" },
];

function setStepState(
  steps: Step[],
  id: string,
  state: Step["state"]
): Step[] {
  return steps.map((s) => (s.id === id ? { ...s, state } : s));
}

export default function StartupScreen({ licenseKey, onReady }: Props) {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [error, setError] = useState("");

  useEffect(() => {
    run();
  }, []);

  async function run() {
    const set = (id: string, state: Step["state"]) =>
      setSteps((prev) => setStepState(prev, id, state));

    if (import.meta.env.DEV) {
      for (const step of INITIAL_STEPS) {
        set(step.id, "active");
        await new Promise((r) => setTimeout(r, 700));
        set(step.id, "done");
      }
      setTimeout(onReady, 600);
      return;
    }

    try {
      // Step: docker
      set("docker", "active");
      await invoke("run_command", { program: "docker", args: ["info"] });
      set("docker", "done");

      // Step: license (write key to farm dir)
      set("license", "active");
      await invoke("run_command", {
        program: "sh",
        args: ["-c", `mkdir -p ~/farm/logs && echo '${licenseKey}' > ~/farm/logs/license_key.txt`],
      });
      set("license", "done");

      // Step: pull images
      set("pull", "active");
      for (const tag of ["agent", "dashboard-backend", "dashboard-frontend"]) {
        await invoke("run_command", {
          program: "docker",
          args: ["pull", `ghcr.io/kennydead/claude-agent-farm/${tag}:latest`],
        });
      }
      set("pull", "done");

      // Step: start services
      set("start", "active");
      await invoke("run_command", {
        program: "docker",
        args: ["compose", "-f", `${getResourcePath()}/docker-compose.yml`, "up", "-d",
               "dashboard-db", "dashboard-backend", "dashboard-frontend"],
      });
      // start host bridge
      invoke("run_command", {
        program: "python3",
        args: [`${getResourcePath()}/host_bridge.py`],
      }).catch(() => {});
      set("start", "done");

      // Step: wait for dashboard
      set("ready", "active");
      await waitForDashboard();
      set("ready", "done");

      setTimeout(onReady, 600);
    } catch (e: any) {
      setError(String(e));
      setSteps((prev) =>
        prev.map((s) => (s.state === "active" ? { ...s, state: "error" } : s))
      );
    }
  }

  async function waitForDashboard(attempts = 30) {
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch("http://localhost:8090/health");
        if (res.ok) return;
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error("Dashboard did not start in time. Check Docker logs.");
  }

  return (
    <Layout>
      <div className="screen">
        <div className="screen-header">
          <h1>Starting Flux</h1>
          <p className="screen-subtitle">Setting up your agent farm…</p>
        </div>

        <div className="screen-body">
          <div className="stepper">
            {steps.map((step) => (
              <div key={step.id} className={`step step-${step.state}`}>
                <div className="step-icon">
                  {step.state === "done" && <span className="step-check">✓</span>}
                  {step.state === "active" && <span className="step-pulse" />}
                  {step.state === "error" && <span className="step-error-icon">✕</span>}
                  {step.state === "pending" && <span className="step-dot" />}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="startup-error">
              <p className="field-error">{error}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function getResourcePath(): string {
  // In production, resources are extracted next to the binary
  // In dev, use the resources folder relative to project root
  return window.__TAURI_INTERNALS__ ? "." : "../resources";
}

declare global {
  interface Window { __TAURI_INTERNALS__: unknown; }
}
