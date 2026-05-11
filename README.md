<div align="center">
  <img src="https://raw.githubusercontent.com/stillup/brand/main/logo.png" alt="StillUp Logo" width="200" />
  <h1>STILLUP</h1>
  <p><strong>The High-Fidelity Infrastructure Sentinel for Modern DevOps</strong></p>
  
  [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-acidlime.svg)](LICENSE)
  [![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)]()
  [![Status](https://img.shields.io/badge/status-production--ready-green.svg)]()
</div>

---

## ⚡ The Monitor That Thinks

StillUp is more than an uptime checker. It's a security-hardened **Infrastructure Sentinel** that understands your system's heartbeat patterns and secure tunnel telemetries. Built for engineers who demand robust safety audits, real-time observability, and a premium visual experience.

### ✨ Key Features

- 🛡️ **Secure Tunnel Monitoring**: Real-time handshake tracking and latency metrics for encrypted networks (WireGuard, SSH, OpenVPN). Detect silent failures before they break your access.
- 🧠 **Cryptographic Memory**: We track every handshake, key rotation, and heartbeat. Identify trends in network degradation and past resolution patterns.
- 🔐 **Hardened Security Vault**: Enterprise-grade RBAC, Audit Logging, and AES-256-GCM secret encryption at rest. Track certificate validity and key age.
- 🎨 **Sentinel Hub UI**: A premium, glassmorphic command center with a dynamic 'Control Center' grid, real-time pulse visualizations, and acid-lime aesthetics.
- 🚀 **Instant Alerting**: Deep-linked, context-rich alerts dispatched via Slack (Block Kit), Discord (Embeds), and custom webhooks in milliseconds.
- 📊 **Zero-Agent Telemetry**: Monitor crons and backups globally by simply appending a curl to your scripts. No invasive agents required.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-org/stillup.git
cd stillup
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Set your DATABASE_URL and MASTER_ENCRYPTION_KEY
```

### 3. Initialize Database
```bash
pnpm db:push
pnpm db:generate
```

### 4. Launch Intelligence
```bash
pnpm run dev
```
Visit `http://localhost:3000` to access the dashboard.

## 🛡️ Security Architecture

StillUp is designed with a "Secure by Default" philosophy:
- **Zero Plaintext Secrets**: Webhook URLs and tokens are encrypted with industry-standard AES-256-GCM.
- **Role-Based Access**: Granular control over who can modify your infrastructure.
- **Audit Trails**: Every login, deletion, and configuration change is logged for compliance.

## 📖 Documentation

Explore our full documentation suite in the [`/docs`](./docs) directory:
- [Introduction](./docs/introduction.md)
- [Architecture & Security](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## ⚖️ License

StillUp is open-source software licensed under the [AGPL-3.0 License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ by the StillUp Team</p>
  <p><i>"Because sleeping well starts with knowing everything is still up."</i></p>
</div>