# Claude Agent Farm

An autonomous software development system powered by AI agents. Agents pick up tickets, write code, review it, and merge pull requests — without you writing a single line of code.

---

## Requirements

- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- **A claude.ai account** (Max plan recommended)
- A GitHub token provided by your Claude Agent Farm license

---

## Setup — Mac / Linux

```bash
git clone https://github.com/kennydead/claude-agent-farm-dist.git ~/farm
cd ~/farm
bash start.sh
```

1. Open **http://localhost:5174** in your browser and complete the setup wizard
2. Authenticate Claude (one-time):
   ```bash
   bash ~/farm/setup.sh
   ```
3. Go to the dashboard → Agents page and spawn your agents

---

## Setup — Windows

**Step 1 — Install the prerequisites**

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and enable the WSL2 backend when prompted
- Install Windows Terminal:
  ```
  winget install Microsoft.WindowsTerminal
  ```

**Step 2 — Open a Linux terminal**

Open **Windows Terminal** and click the dropdown arrow next to the `+` tab — select **Ubuntu**.

All commands below must be run inside this Ubuntu tab.

**Step 3 — Clone and start**

```bash
git clone https://github.com/kennydead/claude-agent-farm-dist.git ~/farm
cd ~/farm
bash start.sh
```

**Step 4 — Complete setup in the browser**

Open **http://localhost:5174** and follow the setup wizard.

**Step 5 — Authenticate Claude**

```bash
bash ~/farm/setup.sh
```

A browser window will open. Log in with your claude.ai account.

**Step 6 — Spawn agents**

Go to the dashboard → Agents page and spawn your agents.

---

## Updating

When a new version is available:

```bash
cd ~/farm
docker compose pull
bash start.sh
```

---

## Stopping and starting

```bash
# Stop
docker compose down

# Start again
cd ~/farm && bash start.sh
```
