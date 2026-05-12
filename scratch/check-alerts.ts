import { prisma } from '../packages/db/src/index.ts'

async function checkAlerts() {
  console.log('--- Checking Alert Configuration ---')
  
  const monitors = await (prisma as any).monitor.findMany({
    where: { heartbeatToken: 'wg-tunnel-test-token' },
    select: { id: true, name: true, projectId: true }
  })
  
  if (monitors.length === 0) {
    console.log('Monitor wg-tunnel-test-token NOT FOUND')
    return
  }
  
  const monitor = monitors[0]
  console.log(`Monitor: ${monitor.name} (ID: ${monitor.id}, ProjectID: ${monitor.projectId})`)
  
  const channels = await (prisma as any).alertChannel.findMany({
    where: { projectId: monitor.projectId }
  })
  
  console.log(`Alert Channels for this Project (${channels.length}):`)
  channels.forEach((c: any) => {
    let decrypted = null
    try {
      // Manual decryption test
      const [iv, authTag, encrypted] = c.config.split(':')
      decrypted = !!(iv && authTag && encrypted) ? 'Encrypted' : 'Plain'
    } catch (e) {
      decrypted = 'Unknown/Broken'
    }
    console.log(`- [${c.type}] Enabled: ${c.enabled}, ConfigState: ${decrypted}, ID: ${c.id}`)
  })
  
  const openIncidents = await (prisma as any).incident.findMany({
    where: { monitorId: monitor.id },
    orderBy: { startedAt: 'desc' },
    take: 3
  })
  
  console.log(`\nRecent Incidents (${openIncidents.length}):`)
  for (const inc of openIncidents) {
    const alerts = await (prisma as any).alert.findMany({
      where: { incidentId: inc.id },
      include: { channel: true }
    })
    console.log(`- Incident ${inc.id.substring(0, 8)} [${inc.type}] Started: ${inc.startedAt.toISOString()}, Resolved: ${inc.resolvedAt ? 'Yes' : 'No'}`)
    alerts.forEach((a: any) => {
      console.log(`  └─ Alert ${a.id.substring(0, 8)}: ${a.status} (Sent: ${a.sentAt || 'N/A'}, Error: ${a.error || 'None'})`)
    })
  }
}

checkAlerts().catch(console.error).finally(() => prisma.$disconnect())
