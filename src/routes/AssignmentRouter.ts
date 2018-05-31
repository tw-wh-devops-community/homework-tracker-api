import { Router, Request, Response, NextFunction } from 'express'
import {
  createAssignments,
  deleteAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
} from '../controllers/AssignmentController'
import { getAssignmentOperateLogs } from '../controllers/AssignmentOperateLogController'

class AssignmentRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private withErrorHandler(apiHandler): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await apiHandler(req, res)
      } catch (err) {
        next(err)
      }
    }
  }

  private init(): void {
    this.router.get('/assignments', this.withErrorHandler(getAssignments))
    this.router.get('/assignments/:id', this.withErrorHandler(getAssignment))
    this.router.get('/assignments/:id/assignmentOperateLogs', this.withErrorHandler(getAssignmentOperateLogs))
    this.router.post('/assignments', this.withErrorHandler(createAssignments))
    this.router.delete('/assignments/:id', this.withErrorHandler(deleteAssignment))
    this.router.put('/assignments', this.withErrorHandler(updateAssignment))
  }
}

export default new AssignmentRouter().router
