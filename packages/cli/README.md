# @stillup/cli

> The Infrastructure Safety Layer in your terminal.

StillUp Sentinel CLI is the official command-line interface for monitoring, guarding, and observing your infrastructure heartbeats.

## Installation

```bash
npm install -g @stillup/cli
```

## Getting Started

1. **Login** with your API Key:
   ```bash
   stillup login <your-api-key>
   ```

2. **Send a Heartbeat** manually:
   ```bash
   stillup hb <monitor-token>
   ```

3. **Monitor a Tunnel** (Latency + Handshake):
   ```bash
   stillup tunnel monitor <monitor-token> --target 8.8.8.8 --interval 60
   ```

4. **Check ReplayGuard Status**:
   ```bash
   stillup guard status <execution-id>
   ```

5. **View Activity Logs**:
   ```bash
   stillup logs --limit 10
   ```

6. **Manage Monitors**:
   ```bash
   # List all monitors
   stillup monitor list
   
   # Add a new Tunnel monitor (as seen in docs)
   stillup monitor add --type tunnel --name "HQ-Office-VPN" --threshold 180s
   
   # Delete a monitor
   stillup monitor delete <monitor-id>
   ```

## Features

- **Heartbeat Pulses**: Simple CLI pings to keep your monitors alive.
- **Tunnelight Engine**: Continuous latency and handshake monitoring for secure tunnels.
- **ReplayGuard Observation**: Inspect guarded execution status and side effects.
- **Secure Configuration**: Uses standard OS-level config stores to keep your keys safe.

## License

MIT
