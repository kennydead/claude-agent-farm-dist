import Button from "../components/Button";
import "./HomeScreen.css";

interface Props {
  onStart: () => void;
  isConfigured: boolean;
}

const FEATURES = [
  { icon: "⚡", label: "Multiple AI agents working in parallel" },
  { icon: "🐳", label: "Runs locally in Docker — your code stays private" },
  { icon: "🔧", label: "Built for real software projects" },
];

export default function HomeScreen({ onStart, isConfigured }: Props) {
  return (
    <div className="home">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-glow" />
        <div className="home-icon">
          <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
            <polygon points="28,6 50,18 50,38 28,50 6,38 6,18" fill="url(#g1)" opacity="0.2" />
            <polygon points="28,11 46,21 46,35 28,45 10,35 10,21" fill="url(#g1)" opacity="0.35" />
            <polygon points="28,17 42,25 42,33 28,41 14,33 14,25" fill="url(#g1)" />
            <defs>
              <linearGradient id="g1" x1="6" y1="6" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F8EF7" />
                <stop offset="1" stopColor="#7C5CFC" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="home-title">Flux</h1>
        <p className="home-tagline">AI Agent Farm</p>
        <p className="home-desc">
          Spin up a team of AI agents that plan, code, and review your software —
          all running locally on your machine.
        </p>
      </div>

      {/* Features */}
      <ul className="home-features">
        {FEATURES.map((f) => (
          <li key={f.label} className="home-feature">
            <span className="home-feature-icon">{f.icon}</span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="home-cta">
        {isConfigured && (
          <div className="home-ready">
            <span className="home-ready-dot" />
            Ready to start
          </div>
        )}
        <Button onClick={onStart} fullWidth>
          Get Started
        </Button>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <span className="home-version">v0.1.0</span>
        <div className="home-links">
          <a className="home-link" href="#" onClick={(e) => e.preventDefault()}>Help</a>
          <span className="home-dot">·</span>
          <a className="home-link" href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <span className="home-dot">·</span>
          <a className="home-link" href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <span className="home-dot">·</span>
          <a className="home-link" href="#" onClick={(e) => e.preventDefault()}>Website</a>
        </div>
      </footer>
    </div>
  );
}
