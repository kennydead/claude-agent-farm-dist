#!/bin/bash
# Claude Agent Farm — one-time Claude authentication
echo "Authenticating Claude..."
echo "A browser window will open. Log in with your claude.ai account."
echo ""
docker run --rm -it \
  -v claudeagentfarm_claude-home:/home/agent \
  ghcr.io/kennydead/claude-agent-farm/agent:latest \
  claude auth login
echo ""
echo "Done! You can now spawn agents from the dashboard."
