import { Request, Response, NextFunction } from 'express'
import { ProjectService } from '../services/project.service'

export class ProjectController {
  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
      const projects = await ProjectService.getAll()
      res.status(200).json({ success: true, data: projects })
    } catch (error) {
      next(error)
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const project = await ProjectService.getById(id)
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' })
        return
      }
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
      res.status(200).json({ success: true, data: project })
    } catch (error) {
      next(error)
    }
  }
}
