import { initSentry } from "./lib/sentry.js";

// Initialize Sentry first
initSentry();

import { startServer } from "./server.js";
import { startMissedHeartbeatWorker } from "./worker/missedHeartbeatWorker.js";
import { scheduleAnalyticsWorker } from "./worker/analyticsWorker.js";

// Start background workers
startMissedHeartbeatWorker();
scheduleAnalyticsWorker();

// Start API server
startServer();
