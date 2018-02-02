import { Router } from 'express'

import {
  createAssignments,
  deleteAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
} from '../controllers/AssignmentController'

class AssignmentRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  private init(): void {
    this.router.get('/assignments', getAssignments)
    this.router.get('/assignments/:id', getAssignment)
    this.router.post('/assignments', createAssignments)
    this.router.delete('/assignments/:id', deleteAssignment)
    this.router.put('/assignments', updateAssignment)
  }
}

export default new AssignmentRouter().router
