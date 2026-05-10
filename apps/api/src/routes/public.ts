import { Router, Request, Response } from 'express'
import { prisma } from '@stillup/db'

const router = Router()

/**
 * GET /api/public/status/:slug
 * Returns public health data for a project
 */
router.get('/status/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const project = await (prisma as any).project.findUnique({
      where: { publicSlug: slug, isPublic: true },
      select: {
        id: true,
        name: true,
        monitors: {
          where: { publicVisibility: true, deletedAt: null },
          select: {
            id: true,
            name: true,
            status: true,
            healthScore: true,
            lastHeartbeatAt: true,
          }
        }
      }
    })

    if (!project) {
      res.status(404).json({ error: 'Status page not found' })
      return
    }

    res.json(project)
  } catch (error) {
    console.error('Public status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
