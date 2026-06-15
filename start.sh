#!/bin/bash
# Claude Agent Farm — start script
set -e

mkdir -p logs
touch .env

echo "Pulling latest images..."
docker pull ghcr.io/kennydead/claude-agent-farm/agent:latest
docker pull ghcr.io/kennydead/claude-agent-farm/dashboard-backend:latest
docker pull ghcr.io/kennydead/claude-agent-farm/dashboard-frontend:latest

echo "Tagging images..."
docker tag ghcr.io/kennydead/claude-agent-farm/agent:latest claudeagentfarm-coder
docker tag ghcr.io/kennydead/claude-agent-farm/agent:latest claudeagentfarm-reviewer
docker tag ghcr.io/kennydead/claude-agent-farm/agent:latest claudeagentfarm-planner
docker tag ghcr.io/kennydead/claude-agent-farm/agent:latest claudeagentfarm-auditor

docker compose up -d dashboard-db dashboard-backend dashboard-frontend

echo ""
echo "Dashboard running at http://localhost:5174"
echo ""
