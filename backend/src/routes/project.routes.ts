import { Router } from 'express'
import { ProjectController } from '../controllers/project.controller'

export const projectRouter = Router()

projectRouter.get('/', ProjectController.getAll)
projectRouter.get('/:id', ProjectController.getById)

