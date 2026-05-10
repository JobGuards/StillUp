import { prisma } from '@stillup/db'
import { subDays } from 'date-fns'

/**
 * PR #40: Monitor Health Score Service
 *
 * Calculates a 0–100 health score for a monitor based on:
 * - Base: 30-day uptime percentage  (max 70 pts)
 * - Penalty: Recent failures        (-5 per failure, up to -20)
 * - Penalty: Active failure patterns (-10 per pattern, up to -20)
 * - Bonus: Success streak           (+5 per 7-day clean streak, up to +10)
 */
export const healthScoreService = {
  async calculateAndUpdate(monitorId: string): Promise<number> {
    const score = await this.calculate(monitorId)

    await (prisma as any).monitor.update({
      where: { id: monitorId },
      data: { healthScore: score },
    })

    return score
  },

  async calculate(monitorId: string): Promise<number> {
    const thirtyDaysAgo = subDays(new Date(), 30)
    const sevenDaysAgo = subDays(new Date(), 7)

    // Fetch heartbeats in the last 30 days
    const heartbeats = await (prisma as any).heartbeat.findMany({
      where: { monitorId, receivedAt: { gte: thirtyDaysAgo } },
      select: { type: true, receivedAt: true },
      orderBy: { receivedAt: 'desc' },
    }) as { type: string; receivedAt: Date }[]

    if (heartbeats.length === 0) return 100 // New monitor, healthy by default

    const total = heartbeats.length
    const successes = heartbeats.filter(h => h.type === 'SUCCESS').length
    const uptimePct = (successes / total) * 100

    // Base score: uptime (max 70)
    let score = (uptimePct / 100) * 70

    // Penalty: recent failures in last 7 days (max -20)
    const recentFailures = heartbeats.filter(
      h => h.type === 'FAILURE' && new Date(h.receivedAt) >= sevenDaysAgo
    ).length
    const recentPenalty = Math.min(recentFailures * 5, 20)
    score -= recentPenalty

    // Penalty: active failure patterns (max -20)
    const activePatterns = await (prisma as any).failurePattern.count({
      where: { monitorId, active: true },
    })
    const patternPenalty = Math.min(activePatterns * 10, 20)
    score -= patternPenalty

    // Bonus: success streak (heartbeats are sorted most recent first)
    let streakBonus = 0
    let streak = 0
    for (const hb of heartbeats) {
      if (hb.type === 'SUCCESS') {
        streak++
        if (streak >= 7) {
          streakBonus = Math.min(streakBonus + 5, 10)
          streak = 0
        }
      } else {
        break
      }
    }
    score += streakBonus

    // Clamp to [0, 100]
    return Math.max(0, Math.min(100, Math.round(score)))
  },

  /** Get health score label */
  getLabel(score: number): { label: string; color: string } {
    if (score >= 90) return { label: 'Excellent', color: 'emerald' }
    if (score >= 75) return { label: 'Good', color: 'green' }
    if (score >= 60) return { label: 'Fair', color: 'yellow' }
    if (score >= 40) return { label: 'Degraded', color: 'orange' }
    return { label: 'Critical', color: 'red' }
  },
}
