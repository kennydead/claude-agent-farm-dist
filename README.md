# Claude Agent Farm

An autonomous software development system powered by AI agents. Agents pick up tickets, write code, review it, and merge pull requests — without you writing a single line of code.

---

## Requirements

- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- **A claude.ai account** (Max plan recommended)
- A GitHub token provided by your Claude Agent Farm license

---

## Installation

**Mac / Linux**

```bash
git clone https://github.com/kennydead/claude-agent-farm-dist.git
cd claude-agent-farm-dist
./start.sh
```

**Windows**

Open Windows Terminal → Ubuntu tab:

```bash
git clone https://github.com/kennydead/claude-agent-farm-dist.git
cd claude-agent-farm-dist
bash start.sh
```

---

## First-time setup

1. After running `start.sh`, open **http://localhost:5174** in your browser
2. The setup wizard will guide you through connecting your GitHub account and creating your first project
3. Authenticate Claude by running this once in your terminal:
   ```bash
   docker compose run --rm --entrypoint="" coder claude auth login
   ```
4. Go to the dashboard → Agents page and spawn your agents

---

## Updating

When a new version is available:

```bash
docker compose pull
docker compose up -d
```

---

## Stopping and starting

```bash
# Stop
docker compose down

# Start again
./start.sh
```
