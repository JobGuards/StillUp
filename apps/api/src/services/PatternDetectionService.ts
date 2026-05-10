import { prisma } from '@stillup/db'
import { subDays } from 'date-fns'

interface HeartbeatSample {
  type: string
  isLate: boolean
  duration: number | null
  receivedAt: Date
}

/**
 * PR #39: Failure Pattern Detection Service
 *
 * Analyzes heartbeat history to detect:
 * 1. Time-based patterns (e.g. failures every Monday 2am)
 * 2. Duration anomalies (job taking 10x longer than usual)
 * 3. Failure streaks
 * 4. Degradation trends
 */
export const patternDetectionService = {
  async analyzeMonitor(monitorId: string): Promise<void> {
    const thirtyDaysAgo = subDays(new Date(), 30)

    const heartbeats: HeartbeatSample[] = await (prisma as any).heartbeat.findMany({
      where: { monitorId, receivedAt: { gte: thirtyDaysAgo } },
      select: { type: true, isLate: true, duration: true, receivedAt: true },
      orderBy: { receivedAt: 'asc' },
    })

    if (heartbeats.length < 10) return // Not enough data

    await Promise.all([
      this.detectTimeBasedPattern(monitorId, heartbeats),
      this.detectDurationAnomaly(monitorId, heartbeats),
      this.detectFailureStreak(monitorId, heartbeats),
      this.detectDegradationTrend(monitorId, heartbeats),
    ])
  },

  async detectTimeBasedPattern(monitorId: string, heartbeats: HeartbeatSample[]): Promise<void> {
    const failures = heartbeats.filter(h => h.type === 'FAILURE')
    if (failures.length < 3) return

    // Count failures by day-of-week + hour slot
    const slotCounts: Record<string, number> = {}
    const slotTotal: Record<string, number> = {}

    for (const hb of heartbeats) {
      const d = new Date(hb.receivedAt)
      const key = `${d.getUTCDay()}_${d.getUTCHours()}`
      slotTotal[key] = (slotTotal[key] || 0) + 1
      if (hb.type === 'FAILURE') slotCounts[key] = (slotCounts[key] || 0) + 1
    }

    for (const [key, failCount] of Object.entries(slotCounts)) {
      const total = slotTotal[key] || 1
      const failureRate = failCount / total
      if (failureRate >= 0.6 && failCount >= 3) {
        const [dayOfWeek, hour] = key.split('_').map(Number)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const confidence = Math.min(failureRate, 1)

        await this.upsertPattern(monitorId, 'time_based', {
          description: `Failures consistently occur on ${days[dayOfWeek]} around ${hour}:00 UTC (${Math.round(failureRate * 100)}% failure rate)`,
          confidence,
          metadata: { dayOfWeek, hour, failureRate: Math.round(failureRate * 100) },
        })
      }
    }
  },

  async detectDurationAnomaly(monitorId: string, heartbeats: HeartbeatSample[]): Promise<void> {
    const withDuration = heartbeats.filter(h => h.duration != null && h.type === 'SUCCESS')
    if (withDuration.length < 10) return

    const durations = withDuration.map(h => h.duration as number)
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length
    const stdDev = Math.sqrt(variance)

    const recentDurations = withDuration.slice(-5).map(h => h.duration as number)
    const recentAvg = recentDurations.reduce((a, b) => a + b, 0) / recentDurations.length

    const zScore = stdDev > 0 ? (recentAvg - mean) / stdDev : 0

    if (zScore > 2.5) {
      const ratio = Math.round(recentAvg / mean)
      await this.upsertPattern(monitorId, 'duration_anomaly', {
        description: `Job duration has increased significantly: recently averaging ${Math.round(recentAvg)}ms vs historical average of ${Math.round(mean)}ms (${ratio}x slower)`,
        confidence: Math.min(zScore / 5, 1),
        metadata: { historicalAvgMs: Math.round(mean), recentAvgMs: Math.round(recentAvg), zScore: Math.round(zScore * 10) / 10 },
      })
    }
  },

  async detectFailureStreak(monitorId: string, heartbeats: HeartbeatSample[]): Promise<void> {
    const recent = heartbeats.slice(-10)
    const recentFailures = recent.filter(h => h.type === 'FAILURE').length

    if (recentFailures >= 5) {
      await this.upsertPattern(monitorId, 'streak', {
        description: `High recent failure rate: ${recentFailures} failures in last 10 heartbeats`,
        confidence: recentFailures / 10,
        metadata: { recentFailures, recentTotal: 10 },
      })
    } else {
      // Deactivate streak pattern if it recovered
      await (prisma as any).failurePattern.updateMany({
        where: { monitorId, type: 'streak', active: true },
        data: { active: false },
      })
    }
  },

  async detectDegradationTrend(monitorId: string, heartbeats: HeartbeatSample[]): Promise<void> {
    if (heartbeats.length < 20) return

    // Compare first half vs second half failure rate
    const mid = Math.floor(heartbeats.length / 2)
    const firstHalf = heartbeats.slice(0, mid)
    const secondHalf = heartbeats.slice(mid)

    const firstFailRate = firstHalf.filter(h => h.type === 'FAILURE').length / firstHalf.length
    const secondFailRate = secondHalf.filter(h => h.type === 'FAILURE').length / secondHalf.length

    const degradation = secondFailRate - firstFailRate

    if (degradation >= 0.2) {
      await this.upsertPattern(monitorId, 'degradation', {
        description: `Monitor reliability is declining: failure rate increased from ${Math.round(firstFailRate * 100)}% to ${Math.round(secondFailRate * 100)}% over the past 30 days`,
        confidence: Math.min(degradation * 2, 1),
        metadata: {
          earlyFailureRate: Math.round(firstFailRate * 100),
          recentFailureRate: Math.round(secondFailRate * 100),
          degradationPct: Math.round(degradation * 100),
        },
      })
    }
  },

  async upsertPattern(
    monitorId: string,
    type: string,
    data: { description: string; confidence: number; metadata?: any }
  ): Promise<void> {
    const existing = await (prisma as any).failurePattern.findFirst({
      where: { monitorId, type, active: true },
    })

    if (existing) {
      await (prisma as any).failurePattern.update({
        where: { id: existing.id },
        data: {
          description: data.description,
          confidence: data.confidence,
          metadata: data.metadata,
          lastSeenAt: new Date(),
          occurrences: { increment: 1 },
        },
      })
    } else {
      await (prisma as any).failurePattern.create({
        data: {
          monitorId,
          type,
          description: data.description,
          confidence: data.confidence,
          metadata: data.metadata,
          active: true,
        },
      })
    }
  },
}
