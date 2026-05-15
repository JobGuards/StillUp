# StillUp: The Self-Hosted Sovereign Guide

StillUp is built for the **Sovereign Homelab** and the **Next Generation of Autonomous Agents**. While enterprise teams use us for financial transaction safety, self-hosters use us to build more reliable AI agents and keep their automated lives from falling apart.

## 🛡️ Why Self-Hosters Need a Safety Layer

Automation on consumer hardware is prone to "Silent Failures"—reboots, power cuts, and ISP drops. StillUp solves common homelab pain points:

### 1. Smart Home & Home Assistant Safety
Home automation scripts can get stuck in "undefined" states if a network glitch happens mid-command. 
- **The Solution**: Use `onRollback` to ensure that if a "Lock Doors" or "Turn Off Stove" command fails halfway through, the system reverts to a safe, known state.

### 2. Media Scraping & Download Stacks
Automated downloaders (Radarr, Sonarr, Torrent stacks) can sometimes loop or spawn duplicate threads when a network glitch occurs.
- **The Solution**: `ReplayGuard™` ensures you don't accidentally hammer external metadata APIs (like TMDB) and get your IP banned, or spin up 50 duplicate download processes.

### 3. Local AI Stability (Ollama / LocalAI)
Local LLM generation is slow and resource-heavy. Accidental loops in AI agent scripts can pin your CPU/GPU at 100% for hours.
- **The Solution**: Prevent redundant AI loops by fingerprinting the agent's intent before it executes.

### 4. Autonomous Agent Reliability
Building agents that *actually work* requires handling non-deterministic failures. If an agent fails mid-task, it shouldn't restart from scratch and repeat expensive or dangerous actions.
- **The Solution**: StillUp provides the "Infrastructure Memory" needed for agents to resume tasks safely, preventing double-actions and ensuring state consistency.

---

## 🚀 One-Click Deployment (Docker)

StillUp is **100% locally hostable**. No telemetry, no external cloud dependencies, and 100% local data retention.

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  stillup-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: stillup
      POSTGRES_PASSWORD: password
    volumes:
      - ./data/db:/var/lib/postgresql/data

  stillup-app:
    image: stillup/stillup:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@stillup-db:5432/stillup
      MASTER_ENCRYPTION_KEY: ${MASTER_ENCRYPTION_KEY}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - stillup-db
```

---

## 💻 Local-First CLI

When using the StillUp CLI locally, always point it to your local instance URL:

```bash
# Login to your local instance
stillup login --url http://localhost:3000 --key YOUR_PROJECT_API_KEY

# Pulse a heartbeat from your local monitor
stillup hb your-local-token
```

## ⚖️ License: AGPL-3.0
StillUp is committed to the Open Source community. Our AGPL-3.0 license ensures that StillUp remains free and sovereign for the self-hosted community forever.
