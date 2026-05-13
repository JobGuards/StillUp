# @stillup/guard-sdk

ReplayGuard™ is the exactly-once execution engine for AI agents and background jobs.

## Installation

```bash
npm install @stillup/guard-sdk
```

## Basic Usage

```typescript
import { withReplayGuard } from '@stillup/guard-sdk';

const config = {
  apiKey: process.env.STILLUP_API_KEY,
  monitorId: 'your-monitor-id',
};

async function processOrder(orderId: string) {
  await withReplayGuard(config, async (guard) => {
    // This action will ONLY run once, even if the job retries
    const charge = await guard.wrap('PAYMENT', 'stripe-charge', { orderId }, async () => {
      return await stripe.charges.create({ ... });
    });

    console.log('Charge successful:', charge.id);
  }, orderId);
}
```

## 🚀 Production Safety Features

### 1. Fail-Safe Policies
Choose how the SDK behaves if the StillUp API is unreachable.
- `OPEN` (Default): Proceed with execution if safety cannot be verified (High availability).
- `CLOSED`: Block execution if safety cannot be verified (High integrity).

```typescript
const guard = new ReplayGuard({
  apiKey: '...',
  monitorId: '...',
  failPolicy: 'CLOSED' // Block on API failure
});
```

### 2. Rollback-Aware Workflows
Register compensation logic that runs automatically if your job fails.

```typescript
await withReplayGuard(config, async (guard) => {
  const payment = await guard.wrap('PAYMENT', 'stripe-charge', inputs, async () => {
    return await stripe.charges.create(...);
  });

  // If the job fails after this point, StillUp will trigger this refund
  await guard.compensate('PAYMENT', 'stripe-charge', inputs, {
    type: 'HTTP_DELETE',
    target: `https://api.stripe.com/v1/refunds/${payment.id}`,
    payload: { reason: 'Job failure compensation' }
  });

  await doNextStep(); // If this throws, the refund above is triggered
});
```

### 3. Project-Wide Deduplication
Prevent duplicate side effects across different monitors or workers in the same project.

```typescript
await guard.verify('AI_ACTION', 'llm-summarize', inputs, { 
  scope: 'PROJECT' 
});
```

## 📈 Replay Intelligence
Every "SKIPPED" action is tracked in the **StillUp Dashboard**, calculating your **Safety ROI** (Prevented double-charges and engineering time saved).
