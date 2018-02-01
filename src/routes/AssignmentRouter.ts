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
    this.router.get('/assignments', listAssignments)
    this.router.get('/assignments/:id', getAssignmentById)
    this.router.post('/assignments', createAssignment)
    this.router.delete('/assignments/:id', deleteAssignment)
  }
}

export default new AssignmentRouter().router
