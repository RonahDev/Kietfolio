import { Router } from 'express'
import { TelemetryController } from '../controllers/telemetry.controller'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware'

export const telemetryRouter = Router()

// Public route for clients/users to submit runtime error reports
telemetryRouter.post('/errors', TelemetryController.recordClientError)

// Query recorded error logs (accessible to verify system status or admin)
telemetryRouter.get('/errors', TelemetryController.getLogs)

// Clear recorded error logs (strictly restricted to Admin)
telemetryRouter.delete('/errors', verifyToken, requireAdmin, TelemetryController.clearLogs)
