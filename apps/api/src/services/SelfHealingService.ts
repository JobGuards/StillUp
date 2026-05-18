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

    // 1. Loop protection: Check if we have already hit max retries for this incident
    const maxRetries = policy.maxRetries || 3
    const previousAttempts = await (prisma as any).auditLog.findMany({
      where: {
        resourceType: 'MONITOR',
        resourceId: monitorId,
        action: 'SELF_HEAL_ATTEMPT',
        projectId: monitor.projectId
      }
    })

    const incidentAttempts = previousAttempts.filter((log: any) => {
      const meta = log.metadata as any
      return meta && meta.incidentId === incidentId
    }).length

    if (incidentAttempts >= maxRetries) {
      console.warn(`[SelfHealing] Max retries (${maxRetries}) reached for incident ${incidentId}. Skipping self-healing.`)
      
      // Log exhaustion to audit log
      await (prisma as any).auditLog.create({
        data: {
          projectId: monitor.projectId,
          action: 'SELF_HEAL_EXHAUSTED',
          resourceType: 'MONITOR',
          resourceId: monitorId,
          metadata: { incidentId, attempts: incidentAttempts }
        }
      })
      return
    }

    console.log(`[SelfHealing] Attempting to heal monitor: ${monitor.name} (${monitorId}). Attempt #${incidentAttempts + 1}/${maxRetries}`)

    // 2. Log the attempt
    await (prisma as any).auditLog.create({
      data: {
        projectId: monitor.projectId,
        action: 'SELF_HEAL_ATTEMPT',
        resourceType: 'MONITOR',
        resourceId: monitorId,
        metadata: { incidentId, policy, attempt: incidentAttempts + 1 }
      }
    })

    // 3. Execute general healing webhook if configured
    if (policy.webhookUrl && !policy.autoReplay) {
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

    // 4. Autonomous ReplayGuard retrigering (the core "2 AM Promise")
    if (monitor.type === 'HEARTBEAT' && policy.autoReplay) {
      console.log(`[SelfHealing] ReplayGuard auto-replay queued for ${monitor.name}`)

      const lastExecution = await (prisma as any).guardExecution.findFirst({
        where: { monitorId },
        orderBy: { startedAt: 'desc' }
      })

      const targetUrl = policy.replayUrl || policy.webhookUrl
      if (targetUrl) {
        try {
          await axios.post(targetUrl, {
            monitorId,
            monitorName: monitor.name,
            incidentId,
            externalId: lastExecution?.externalId || null,
            lastAttempt: lastExecution?.attempt || 0,
            action: 'AUTO_REPLAY',
            timestamp: new Date().toISOString()
          })
          console.log(`[SelfHealing] Auto-replay webhook triggered successfully for ${monitor.name} pointing to ${targetUrl}`)
        } catch (error: any) {
          console.error(`[SelfHealing] Auto-replay webhook failed for ${monitor.name} at ${targetUrl}:`, error.message)
        }
      } else {
        console.warn(`[SelfHealing] No replayUrl or webhookUrl configured in self-healing policy for ${monitor.name}`)
      }
    }
  }
}

export const selfHealingService = new SelfHealingService()
