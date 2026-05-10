# Architecture & Security

StillUp is built as a modular, scalable platform using a modern full-stack architecture. This document outlines the technical design and the security measures that protect your monitoring data.

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), Tailwind CSS 4, Lucide Icons.
- **Backend**: Express API (Node.js), Fastify (optional), Prisma ORM.
- **Database**: PostgreSQL (for core data), Redis (for task queuing and caching).
- **Security**: JWT for authentication, AES-256-GCM for secret encryption.
- **Infrastructure**: Monorepo managed with `pnpm` workspaces.

## System Components

### 1. The API Gateway
The central entry point for all frontend requests and external heartbeats.
- **Rate Limiting**: Custom middleware to prevent abuse (Auth: 100/15min, API: 1000/15min).
- **Authentication**: Secure, HttpOnly cookie-based JWT sessions.

### 2. The Worker Engine
A set of resilient background workers that handle heavy processing.
- **Missed Heartbeat Worker**: Runs every 60s to identify monitors that have missed their grace period.
- **Analytics Worker**: Aggregates daily and weekly performance summaries.
- **Intelligence Engine**: Real-time calculation of health scores and failure pattern detection.

### 3. Security Layers

#### RBAC (Role-Based Access Control)
Every project supports multi-user collaboration with specific roles:
- **OWNER**: Full administrative control, billing, and project deletion.
- **ADMIN**: Can manage monitors, api-keys, and alert channels.
- **MEMBER**: Read-only access to intelligence and dashboard.

#### Field-Level Encryption
Sensitive configurations (Slack Webhooks, Discord Tokens) are encrypted before being written to the database.
- **Algorithm**: AES-256-GCM.
- **Key Management**: Managed via `MASTER_ENCRYPTION_KEY` in the environment.

#### Audit Logging
All state-changing actions are recorded for security and compliance.
- Captured data: User ID, IP Address, User-Agent, Action Type, and Metadata.

## Data Flow

1. **Heartbeat Receipt**: API receives a push -> Writes raw Heartbeat record -> Updates Monitor status to `UP`.
2. **Monitoring**: `MissedHeartbeatWorker` scans for overdue monitors -> Updates status to `DOWN` -> Triggers `IncidentService`.
3. **Alerting**: `AlertService` fetches encrypted channels -> Decrypts just-in-time -> Dispatches to Slack/Discord/Email.
4. **Intelligence**: `HealthScoreService` processes recent history -> Updates dashboard pulse and health scores.
