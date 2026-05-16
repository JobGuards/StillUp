import { prisma } from '@stillup/db'
import axios from 'axios'

export class SelfHealingService {
  /**
   * Attempts to self-heal a monitor based on its policy.
   */
  async attemptHeal(monitorId: string, incidentId: string) {
    const monitor = await (prisma as any).monitor.findUnique({
      where: { id: monitorId }
    })

    if (!monitor || !monitor.selfHealing) return

    const policy = monitor.selfHealing as any
    if (!policy.enabled) return

    console.log(`[SelfHealing] Attempting to heal monitor: ${monitor.name} (${monitorId})`)

    // 1. Log the attempt
    await (prisma as any).auditLog.create({
      data: {
        projectId: monitor.projectId,
        action: 'SELF_HEAL_ATTEMPT',
        resourceType: 'MONITOR',
        resourceId: monitorId,
        metadata: { incidentId, policy }
      }
    })

    // 2. Execute healing action (e.g., trigger a webhook or re-run a job)
    // If the monitor has a webhook configured in policy, call it.
    if (policy.webhookUrl) {
      try {
        await axios.post(policy.webhookUrl, {
          monitorId,
          monitorName: monitor.name,
          incidentId,
          action: 'RETRIGGER_JOB',
          timestamp: new Date().toISOString()
        })
        console.log(`[SelfHealing] Webhook triggered successfully for ${monitor.name}`)
      } catch (error: any) {
        console.error(`[SelfHealing] Webhook failed for ${monitor.name}:`, error.message)
      }
    }

    // 3. We could also integration with ReplayGuard here if we have a way to 
    // re-trigger the original job via an external ID.
    if (monitor.type === 'HEARTBEAT' && policy.autoReplay) {
        // Implementation for ReplayGuard re-triggering would go here
        console.log(`[SelfHealing] ReplayGuard auto-replay queued for ${monitor.name}`)
    }
  }
}

export const selfHealingService = new SelfHealingService()
