import { prisma } from '@stillup/db'
import { EmailAlertProvider } from './alerts/EmailAlertProvider.js'
import { WebhookAlertProvider } from './alerts/WebhookAlertProvider.js'
import { AlertProvider, AlertData } from './alerts/AlertProvider.js'
import { decryptJSON } from '../utils/encryption.js'

export class AlertService {
  private providers: Record<string, AlertProvider> = {
    email: new EmailAlertProvider(),
    webhook: new WebhookAlertProvider(),
  }

  /**
   * Send alerts for a new incident
   */
  async sendIncidentAlert(incident: any) {
    const monitor = await (prisma.monitor as any).findUnique({
      where: { id: incident.monitorId },
    })

    if (!monitor) return

    const channels = await this.getEnabledChannels(monitor.projectId)
    
    for (const channel of channels) {
      await this.sendToChannel(channel, {
        monitor,
        incident,
        type: 'creation',
      })
    }
  }

  /**
   * Send alerts for a resolved incident
   */
  async sendResolutionAlert(incident: any) {
    const monitor = await (prisma.monitor as any).findUnique({
      where: { id: incident.monitorId },
    })

    if (!monitor) return

    const channels = await this.getEnabledChannels(monitor.projectId)
    
    for (const channel of channels) {
      await this.sendToChannel(channel, {
        monitor,
        incident,
        type: 'resolution',
      })
    }
  }

  /**
   * Send alert to a specific channel
   */
  private async sendToChannel(channel: any, data: AlertData) {
    const provider = this.providers[channel.type.toLowerCase()]
    
    if (!provider) {
      console.warn(`[AlertService] No provider found for channel type: ${channel.type}`)
      return
    }

    // Create Alert record to track delivery
    const alertRecord = await (prisma.alert as any).create({
      data: {
        incidentId: data.incident.id,
        channelId: channel.id,
        status: 'pending',
      },
    })

    try {
      // Decrypt config before sending
      const decryptedConfig = typeof channel.config === 'string' 
        ? decryptJSON(channel.config) 
        : channel.config

      await provider.sendAlert(decryptedConfig, data)
      
      // Update Alert record on success
      await (prisma.alert as any).update({
        where: { id: alertRecord.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      })
    } catch (error) {
      console.error(`[AlertService] Error sending alert to channel ${channel.id}:`, error)
      
      // Update Alert record on failure
      await (prisma.alert as any).update({
        where: { id: alertRecord.id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }

  /**
   * Get all enabled alert channels for a project
   */
  private async getEnabledChannels(projectId: string) {
    const channels = await (prisma.alertChannel as any).findMany({
      where: {
        projectId,
        enabled: true,
      },
    })

    // Decrypt configs
    return channels.map((c: any) => ({
      ...c,
      config: typeof c.config === 'string' ? decryptJSON(c.config) : c.config
    }))
  }
}

export const alertService = new AlertService()
