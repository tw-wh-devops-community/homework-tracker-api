import { Router } from 'express'

import {
  createAssignment,
  deleteAssignment,
  listAssignments,
  getAssignmentById,
} from '../controllers/AssignmentController'

class AssignmentRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/assignment', listAssignments)
    this.router.get('/assignment/:id', getAssignmentById)
    this.router.post('/assignment', createAssignment)
    this.router.delete('/assignment/:id', deleteAssignment)
  }
}

export default new AssignmentRouter().router
