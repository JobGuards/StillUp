<div align="center">
  <img src="https://raw.githubusercontent.com/stillup/brand/main/logo.png" alt="StillUp Logo" width="200" />
  <h1>STILLUP</h1>
  <p><strong>Intelligence-Driven Heartbeat Monitoring for Modern Infrastructure</strong></p>
  
  [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-acidlime.svg)](LICENSE)
  [![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)]()
  [![Status](https://img.shields.io/badge/status-production--ready-green.svg)]()
</div>

---

## ⚡ The Monitor That Thinks

StillUp is more than an uptime checker. It's a security-hardened intelligence engine that understands your system's heartbeat patterns. Built for developers who demand robustness, security, and a premium visual experience.

### ✨ Key Features

- 🧠 **Intelligence Engine**: Real-time **Health Scores** and automatic **Failure Pattern Detection**.
- 🔐 **Hardened Security**: Enterprise-grade RBAC, Audit Logging, and AES-256-GCM secret encryption at rest.
- 🎨 **Premium UI**: Glassmorphic dashboard with real-time pulse grids and acid-lime visuals.
- 🚀 **Multi-Channel Alerts**: Rich notifications for Slack (Block Kit), Discord (Embeds), and Email.
- 📊 **Public Status Pages**: Share your system's reliability with beautiful, public-facing health dashboards.
- ⚡ **Resilient Workers**: High-performance background processing with built-in database connection safety.

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